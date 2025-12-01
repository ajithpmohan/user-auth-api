// express
import express from 'express';

// rest of the packages
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// database
import connectDB from './db/connect.js';

// middleware
import errorHandlerMiddleware from './middleware/error-handler.js';
import notFound from './middleware/not-found.js';

// routers
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';

import ENV from './utils/constants.js';
import { connectRedis } from './utils/redis.js';
import winstonLogger from './utils/winston.js';

import setupSwagger from './docs/swaggerSpec.js';

// Initiate Redis connection
connectRedis();

const app = express();

const __filename = fileURLToPath(import.meta.url);

const corsOptions = {
  origin: ENV.CORS_ALLOWED_DOMAINS?.split(',') || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// bodyParser middleware
app.use(express.json());

app.use(cookieParser(ENV.JWT_SECRET));

app.use(
  '/static',
  express.static(path.join(path.dirname(__filename), 'public'))
);

app.use(fileUpload({ debug: false }));

app.use(morgan('combined', { stream: winstonLogger.stream }));

app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

// Set up Swagger
setupSwagger(app);

app.use(notFound);
app.use(errorHandlerMiddleware);

app.enable('trust proxy');

const port = ENV.PORT || 5000;

const start = async () => {
  try {
    await connectDB(ENV.MONGODB_URI);

    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();

export default app;
