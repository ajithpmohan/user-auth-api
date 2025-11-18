import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide image name'],
      maxlength: [64, 'Name can not be more than 64 characters']
    },
    url: {
      type: String,
      required: [true, 'Please provide image url']
    },
    isPublicUrl: {
      type: Boolean,
      default: false
    }
  },
  { _id: false }
);

export default ImageSchema;
