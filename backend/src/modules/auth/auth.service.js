import bcrypt from 'bcrypt';
import { createUser, findUserByEmail } from './auth.repository.js';
import { signToken } from '../../utils/jwt.js';

export async function registerUser({ fullName, email, password }) {
    const existing = await findUserByEmail(email);
    if (existing) {
        throw new Error('Email is already registered');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await createUser({ fullName, email, passwordHash });
    const token = signToken({ sub: user.id, email: user.email });

    return { user, token };
}

export async function loginUser({ email, password }) {
    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
        throw new Error('Invalid credentials');
    }

    const token = signToken({ sub: user.id, email: user.email });

    return {
        token,
        user: {
            id: user.id,
            fullName: user.full_name,
            email: user.email,
            loyaltyPoints: user.loyalty_points
        }
    };
}
