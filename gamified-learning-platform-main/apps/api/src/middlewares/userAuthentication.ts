import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const UserAuth = (req: Request, res: Response, next: NextFunction) => {
    const cookies = (req as any).cookies as Record<string, unknown> | undefined;
    const tokenFromCookie = typeof cookies?.token === 'string' ? cookies?.token : undefined;
    const tokenFromHeader = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : undefined;
    const tokenFromQuery = typeof req.query.token === 'string' ? req.query.token : undefined;

    const token = tokenFromCookie || tokenFromHeader || tokenFromQuery;

    if (!token) {
        res.status(401).json({
            message: "Unauthorized: No token provided"
        });
        return
    }

    // If token is from query params, remove it from URL for security
    if (tokenFromQuery && req.originalUrl) {
        const cleanUrl = req.originalUrl.replace(/[?&]token=[^&]*/, '');
        if (cleanUrl !== req.originalUrl) {
            res.redirect(cleanUrl);
            return
        }
    }

    try {
        const jwtSecret = process.env.JWT_USER_SECRET as string | undefined;
        if (!jwtSecret) {
            res.status(403).json({ message: 'Invalid or expired token' });
            return
        }

        const decoded = jwt.verify(token, jwtSecret) as { id: string; email: string };
        (req as any).user = decoded;
        next();
    } catch (error) {
        res.status(403).json({
            message: "Invalid or expired token"
        });
        return
    }
};


