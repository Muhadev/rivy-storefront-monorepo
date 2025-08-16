import AuthRepository from '../../src/repositories/AuthRepository';
import User from '../../src/models/User';

describe('AuthRepository', () => {
  beforeAll(async () => { await User.sync({ force: true }); });

  it('should create a user', async () => {
    const user = await AuthRepository.create({ email: 'repo@example.com', passwordHash: 'hash', name:'User Repo', role: 'customer' });
    expect(user.email).toBe('repo@example.com');
  });

  it('should find user by email', async () => {
    const user = await AuthRepository.findByEmail('repo@example.com');
    expect(user).toBeTruthy();
    expect(user!.email).toBe('repo@example.com');
  });

  it('should update password', async () => {
    const user = await AuthRepository.findByEmail('repo@example.com');
    expect(user).toBeTruthy();
    const updated = await AuthRepository.updatePassword(user!.id, 'newhash');
    expect(updated).toBeTruthy();
    expect(updated!.passwordHash).toBe('newhash');
  });
});
