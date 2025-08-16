import cors from 'cors';

const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['*'];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

export default cors(corsOptions);
