import User from '../models/User';

interface CreateUserData {
  email: string;
  passwordHash: string;
  name: string;
  role?: 'customer' | 'admin';
}

interface SafeUserData {
  id: number;
  email: string;
  name: string;
  role: 'customer' | 'admin';
}

class AuthRepository {
  static async create(data: CreateUserData): Promise<SafeUserData> {
    const user = await User.create(data);
    const { passwordHash, ...safeUser } = user.get({ plain: true });
    return safeUser as SafeUserData;
  }

  static async findByEmail(email: string) {
    return User.findOne({ where: { email } });
  }

  static async findById(id: number) {
    return User.findByPk(id);
  }

  static async updatePassword(id: number, passwordHash: string) {
    const user = await User.findByPk(id);
    if (!user) return null;
    await user.update({ passwordHash });
    return user.get({ plain: true });
  }
}

export default AuthRepository;
