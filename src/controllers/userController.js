// import { uploadToCloudinary } from '../utils/cloudinary.js';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { StatusCodes } from 'http-status-codes';

import User from '../models/User.js';

import * as CustomError from '../errors/index.js';

import { s3 } from '../utils/aws.js';
import ENV from '../utils/constants.js';
import { emailRegex } from '../utils/helpers.js';
import { attachCookiesToResponse } from '../utils/jwt.js';

const getAllUsers = async (req, res) => {
  const { search, limit, page: currentPage } = req.query;
  const queryParam = search ? { $text: { $search: search } } : {};

  const users = await User.find(queryParam)
    .skip((currentPage - 1) * limit)
    .limit(limit);

  const totalItems = await User.countDocuments(queryParam);
  const totalPages = Math.ceil(totalItems / limit);

  res.status(StatusCodes.OK).json({
    paging: {
      hasMore: currentPage < totalPages,
      currentPage,
      totalPages,
      currentItems: users.length,
      totalItems
    },
    users
  });
};

const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });

  if (!user) {
    throw new CustomError.NotFoundError('User not found');
  }
  return res.status(StatusCodes.OK).json({ user });
};

const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.id });

  return res.status(StatusCodes.OK).json({ user });
};

const updateCurrentUser = async (req, res) => {
  // skipping unwanted data's
  const { email, fullName, dateOfBirth } = req.body;
  const { avatar } = req.files || {};

  if (!email || !fullName) {
    throw new CustomError.BadRequestError(
      'The email address and full name are missing or invalid.'
    );
  }

  if (!emailRegex.test(email)) {
    throw new CustomError.UnprocessableContentError(
      'Provide a valid email address.'
    );
  }

  const validateNewEmail = await User.findOne({ email });

  if (!!validateNewEmail && validateNewEmail.id !== req.user.id) {
    throw new CustomError.ConflictError(
      'The email address provided already exists. Please provide another email.'
    );
  }

  let uploadParams;
  if (avatar) {
    if (!avatar.mimetype.startsWith('image')) {
      throw new CustomError.UnsupportedMediaError(
        'The uploaded file is not a supported image format.'
      );
    }

    const maxSize = 1024 * 1024;

    if (avatar.size > maxSize) {
      throw new CustomError.ContentTooLargeError(
        'Please upload an image smaller than 1MB'
      );
    }

    // Uploading `avatar` to Cloudinary
    // uploadParams = await uploadToCloudinary({
    //   file: avatar,
    //   path: 'avatar'
    // });

    // Uploading `avatar` to Amazon S3
    uploadParams = {
      Bucket: ENV.AWS_S3_BUCKET,
      Key: `avatar/${Date.now()}-${avatar.name}`,
      Body: avatar.data,
      ContentType: avatar.mimetype
    };

    await s3.send(new PutObjectCommand(uploadParams));
  }

  const user = await User.findOneAndUpdate(
    { _id: req.user.id },
    {
      email,
      fullName,
      dateOfBirth,
      ...(avatar && {
        avatar: {
          name: avatar.name,
          url: uploadParams?.Key
          // url: uploadParams?.secure_url,
        }
      })
    },
    {
      new: true,
      runValidators: true
    }
  );

  const payload = { email, id: user._id, role: user.role };
  attachCookiesToResponse({ res, payload });

  res.status(StatusCodes.OK).json({ user });
};

const updatePassword = async (req, res) => {
  let { oldPassword = '', newPassword = '' } = req.body;
  oldPassword = oldPassword.trim();
  newPassword = newPassword.trim();

  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError(
      'The Old Password & New Password values are missing or invalid.'
    );
  }

  if (newPassword.length < 6) {
    throw new CustomError.UnprocessableContentError(
      'Password must contain atleast 6 letters.'
    );
  }

  const user = await User.findOne({ _id: req.user.id });

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnAthorizedError('Invalid Old Password.');
  }

  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: 'Password Successfully Updated.' });
};

export {
  getAllUsers,
  getSingleUser,
  getCurrentUser,
  updateCurrentUser,
  updatePassword
};
