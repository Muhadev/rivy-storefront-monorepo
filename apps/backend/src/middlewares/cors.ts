import cors from 'cors';

const allowedOrigins = [
  'http://localhost:3000',
  'https://rivy-storefront-monorepo-1.onrender.com',
  'http://localhost:3001',
  'http://localhost:3002'
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200, // Support legacy browsers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
};

export default cors(corsOptions);
