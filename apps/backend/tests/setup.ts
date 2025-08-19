import { setupTestDatabase, cleanupTestDatabase } from './testHelpers';

// Global test setup
beforeAll(async () => {
  await setupTestDatabase();
}, 60000); // 30 second timeout for database setup

afterAll(async () => {
  await cleanupTestDatabase();
}, 30000); // 30 second timeout for cleanup
