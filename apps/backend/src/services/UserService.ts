import UserRepository from '.././repositories/UserRepository';

interface UpdateUserData {
  email?: string;
  passwordHash?: string;
  role?: 'customer' | 'admin';
}

class UserService {
  static async getById(id: number) {
    return UserRepository.getById(id);
  }

  static async update(id: number, data: UpdateUserData) {
    return UserRepository.update(id, data);
  }

  static async delete(id: number) {
    return UserRepository.delete(id);
  }
}

export default UserService;
