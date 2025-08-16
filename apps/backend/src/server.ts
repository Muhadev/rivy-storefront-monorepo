import http from 'http';
import app from './app';
import { connectDb } from './db';

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`[backend] listening on http://localhost:${PORT}`);
});

connectDb().then(() => {
  console.log('[backend] database connected')
}).catch(err => {
  console.error('DB connection error', err)
  process.exit(1)
})
