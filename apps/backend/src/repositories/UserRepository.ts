import User from '../models/User';

interface UpdateUserData {
  email?: string;
  passwordHash?: string;
  role?: 'customer' | 'admin';
}

class UserRepository {
  static async getById(id: number) {
    return User.findByPk(id, { attributes: { exclude: ['passwordHash'] } });
  }

  static async update(id: number, data: UpdateUserData) {
    const user = await User.findByPk(id);
    if (!user) return null;
    await user.update(data);
    return user.get({ plain: true });
  }

  static async delete(id: number) {
    const user = await User.findByPk(id);
    if (!user) return false;
    await user.destroy();
    return true;
  }
  static async getAll() {
    const users = await User.findAll({ attributes: { exclude: ['passwordHash'] } });
    return users.map(user => user.get({ plain: true }));
  }
}

export default UserRepository;
