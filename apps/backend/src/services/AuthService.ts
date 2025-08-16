import AuthRepository from '.././repositories/AuthRepository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { log } from '../middlewares/logging';
import { UnauthorizedError, ConflictError, NotFoundError } from '../types/errors';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const RESET_SECRET = process.env.RESET_SECRET || 'resetsecret';

// Security constants
const BCRYPT_ROUNDS = 12; // Industry standard for 2024
const JWT_EXPIRY = '24h';
const RESET_TOKEN_EXPIRY = '1h';

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: 'customer' | 'admin';
}

interface LoginData {
  email: string;
  password: string;
}

interface JWTPayload {
  id: number;
  email: string;
  role: 'customer' | 'admin';
}

class AuthService {
  static async register(data: RegisterData) {
    // Check if user already exists
    const existingUser = await AuthRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);
    const user = await AuthRepository.create({ ...data, passwordHash });
    
    log.info('User registered successfully', { 
      userId: user.id, 
      email: user.email,
      role: user.role 
    });
    
    return user;
  }

  static async login(data: LoginData) {
    const user = await AuthRepository.findByEmail(data.email);
    if (!user) {
      log.warn('Login attempt with non-existent email', { email: data.email });
      throw new UnauthorizedError('Invalid credentials');
    }

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) {
      log.warn('Login attempt with invalid password', { 
        userId: user.id, 
        email: user.email 
      });
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: JWT_EXPIRY }
    );
    
    const { passwordHash, ...safeUser } = user.get ? user.get({ plain: true }) : user;
    
    log.info('User logged in successfully', { 
      userId: user.id, 
      email: user.email 
    });
    
    return { token, user: safeUser };
  }

  static async forgotPassword(email: string) {
    const user = await AuthRepository.findByEmail(email);
    if (!user) {
      log.warn('Password reset attempted for non-existent email', { email });
      return;
    }
    
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.RESET_SECRET || 'resetsecret', { expiresIn: '1h' });
    
    // In production, send email here
    log.info('Password reset token generated', { 
      userId: user.id, 
      email: user.email,
      tokenExpiry: '1h'
    });
    
    // For development only - remove in production
    if (process.env.NODE_ENV === 'development') {
      log.debug(`Password reset link: /reset-password?token=${token}`);
    }
  }

  static async resetPassword(token: string, newPassword: string) {
    let payload: JWTPayload;
    try {
      payload = jwt.verify(token, process.env.RESET_SECRET || 'resetsecret') as JWTPayload;
    } catch {
      throw new Error('Invalid or expired token');
    }
    const user = await AuthRepository.findById(payload.id);
    if (!user) throw new Error('User not found');
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await AuthRepository.updatePassword(user.id, passwordHash);
  }
}

export default AuthService;
