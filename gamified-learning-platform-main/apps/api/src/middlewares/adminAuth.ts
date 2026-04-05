import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../config/firebase';

export const AdminAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cookies = (req as any).cookies as Record<string, unknown> | undefined;
        const token = typeof cookies?.token === 'string' ? cookies.token : undefined;
        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const jwtSecret = process.env.JWT_USER_SECRET as string | undefined;
        if (!jwtSecret) {
            res.status(500).json({ message: 'Server misconfiguration' });
            return;
        }
        const decoded = jwt.verify(token as string, jwtSecret) as { id: string };
        const snap = await db.collection('users').doc(decoded.id).get();
        if (!snap.exists) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const user = snap.data() as any;
        if (user?.role !== 'admin') {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }
        (req as any).user = { id: decoded.id };
        next();
    } catch (e) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};


