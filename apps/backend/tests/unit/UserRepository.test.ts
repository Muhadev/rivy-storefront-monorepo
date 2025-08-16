import UserRepository from '../../src/repositories/UserRepository';
import AuthRepository from '../../src/repositories/AuthRepository';
import User from '../../src/models/User';

describe('UserRepository', () => {
  beforeAll(async () => { await User.sync({ force: true }); });

  it('should create a user via AuthRepository', async () => {
    const user = await AuthRepository.create({ email: 'userrepo@example.com', passwordHash: 'hash', name: 'User Repo', role: 'customer' });
    expect(user.email).toBe('userrepo@example.com');
  });

  it('should find user by id', async () => {
    const user = await AuthRepository.create({ email: 'findid@example.com', passwordHash: 'hash', name: 'Find ID', role: 'customer' });
    const found = await UserRepository.getById(user.id);
    expect(found).toBeTruthy();
    expect(found!.email).toBe('findid@example.com');
  });

  it('should update a user', async () => {
    const user = await AuthRepository.create({ email: 'upd@example.com', passwordHash: 'hash', name: 'Update User', role: 'customer' });
    const updated = await UserRepository.update(user.id, { role: 'admin' });
    expect(updated).toBeTruthy();
    expect(updated!.role).toBe('admin');
  });

  it('should delete a user', async () => {
    const user = await AuthRepository.create({ email: 'del@example.com', passwordHash: 'hash', name:'Delete User', role: 'customer' });
    const deleted = await UserRepository.delete(user.id);
    expect(deleted).toBe(true);
  });
});
