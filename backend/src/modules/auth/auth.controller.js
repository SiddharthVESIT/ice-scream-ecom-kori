import { loginUser, registerUser } from './auth.service.js';
import { findUserById } from './auth.repository.js';

function isEmail(value) {
    return /\S+@\S+\.\S+/.test(value);
}

export async function register(req, res) {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'fullName, email and password are required' });
        }
        if (!isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' });
        }

        const result = await registerUser({ fullName, email, password });
        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'email and password are required' });
        }

        const result = await loginUser({ email, password });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
}

export async function session(req, res) {
    const user = await findUserById(req.user.sub);
    return res.status(200).json({
        message: 'Session active',
        user
    });
}
