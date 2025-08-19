import cors from 'cors';

const allowedOrigins = [
  'http://localhost:3001',
  'https://rivy-storefront-monorepo-1.onrender.com',
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200, // Support legacy browsers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
};

export default cors(corsOptions);
