import { Request, Response } from "express";
import * as admin from 'firebase-admin';
import { auth, db } from "../config/firebase";
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateSubjectsForGrade, generateChaptersForSubject, generateMissionFromTopic } from '../services/geminiService';

export const signup = async (req: Request, res: Response) => {
    try {
        console.log('Signup request received:', req.body);

        const signupSchema = z.object({
            email: z.string().email('Invalid email address.'),
            password: z.string()
                .min(8, 'Password must be at least 8 characters long.')
                .max(128, 'Password must be at most 128 characters long.'),
            displayName: z.string().min(1, 'Display name is required.').max(100)
        });

        const { email, password, displayName } = signupSchema.parse(req.body);

        console.log('Attempting to create user in Firebase Auth...');

        // 1. Create the user in Firebase Authentication (Firebase manages its own hashing)
        const userRecord = await auth.createUser({
            email,
            password,
            displayName,
        });

        console.log('User created in Auth:', userRecord.uid);

        // 2. Hash the password for our own storage (optional, as requested)
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 3. Create a corresponding user profile in Firestore
        const userProfile = {
            uid: userRecord.uid,
            email: userRecord.email,
            displayName: userRecord.displayName,
            role: 'student', // Default role for new signups
            badges: [],
            password: passwordHash,
            level: 1,
            xp: 0,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        await db.collection('users').doc(userRecord.uid).set(userProfile);
        console.log('User profile created in Firestore');

        // Send back a success response
        res.status(201).json({
            message: 'User created successfully!',
            user: {
                uid: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord.displayName,
            },
        });

    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                error: 'Validation failed',
                details: error.issues.map((i) => ({ path: i.path, message: i.message }))
            });
            return;
        }
        const e = error as any;
        const code: string | undefined = e?.code || e?.errorInfo?.code;
        const msg: string | undefined = e?.message || e?.errorInfo?.message;

        console.error('Signup error details:', {
            code,
            message: msg,
            fullError: e,
            stack: e?.stack
        });

        if (code === 'auth/email-already-exists') {
            res.status(409).json({ error: 'Email already in use.' });
            return;
        }
        if (code === 'auth/invalid-password') {
            res.status(400).json({ error: 'Invalid password format.' });
            return;
        }
        if (code === 'auth/invalid-email') {
            res.status(400).json({ error: 'Invalid email address.' });
            return;
        }
        if (code === 'auth/configuration-not-found') {
            res.status(500).json({
                error: 'Firebase configuration error. Please check service account setup.'
            });
            return;
        }

        res.status(500).json({
            error: msg || 'Something Went Wrong, Please Try Again Later'
        });
        return
    }
}


export const signin = async (req: Request, res: Response) => {
    try {
        const signinValidationSchema = z.object({
            email: z.string().email(),
            password: z.string().min(8).max(128)
        });

        const result = signinValidationSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                message: "Validation error",
                errors: result.error.flatten().fieldErrors,
            });
            return;
        }

        const { email, password } = result.data;

        // Find the user in Firestore
        const snapshot = await db.collection('users')
            .where('email', '==', email)
            .limit(1)
            .get();

        if (snapshot.empty) {
            res.status(400).json({
                message: "User Not Found"
            });
            return;
        }

        const userDoc = snapshot.docs[0];
        const user = userDoc.data() as { email: string; password?: string };

        const storedHash = user.password;
        if (!storedHash) {
            res.status(500).json({ message: 'User record invalid: missing password hash' });
            return;
        }

        // Compare password with hashed password
        const matchPassword = await bcrypt.compare(password, storedHash);
        if (!matchPassword) {
            res.status(401).json({
                message: "Incorrect Password!"
            });
            return;
        }

        // Generate JWT token
        const jwtSecret = process.env.JWT_USER_SECRET as string | undefined;
        if (!jwtSecret) {
            res.status(500).json({ message: 'Server misconfiguration: missing JWT secret' });
            return;
        }

        const token = jwt.sign(
            {
                id: userDoc.id,
                email: user.email
            },
            jwtSecret,
            {
                expiresIn: "4d"
            }
        );

        const isDev = process.env.NODE_ENV === 'development';
        res.status(200)
            .cookie("token", token, {
                httpOnly: true,
                secure: !isDev,
                sameSite: isDev ? "lax" : "none",
                maxAge: 4 * 24 * 60 * 60 * 1000,
                path: "/"
            })
            .json({
                success: true,
                message: "User Logged In Successfully!",
                user: {
                    id: userDoc.id,
                    email: user.email
                }
            });
        return;
    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                message: "Validation error",
                errors: error.flatten().fieldErrors,
            });
            return;
        }
        console.error('Signin error:', error);
        res.status(500).json({ message: 'Something Went Wrong, Please Try Again Later' });
        return;
    }
}

export const logout = async (req: Request, res: Response) => {
    const isDev = process.env.NODE_ENV === 'development';
    res.clearCookie("token", { httpOnly: true, secure: !isDev, sameSite: isDev ? "lax" : "none" });
    res.status(200).json({
        message: "User Logged Out Successfully!"
    });
    return
}

export const session = async (req: Request, res: Response) => {
    try {
        const cookies = (req as any).cookies as Record<string, unknown> | undefined;
        const tokenFromCookie = typeof cookies?.token === 'string' ? cookies?.token : undefined;
        const tokenFromHeader = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : undefined;
        const tokenFromQuery = typeof req.query.token === 'string' ? req.query.token : undefined;
        const token = tokenFromCookie || tokenFromHeader || tokenFromQuery;

        if (!token) {
            res.status(200).json({
                message: {
                    isAuthenticated: false,
                    user: null
                }
            });
            return
        }

        const jwtSecret = process.env.JWT_USER_SECRET as string | undefined;
        if (!jwtSecret) {
            res.status(200).json({
                message: {
                    isAuthenticated: false,
                    user: null
                }
            });
            return
        }

        const decoded = jwt.verify(token, jwtSecret) as { id: string, email: string };

        // Fetch user from Firestore by document id
        const userSnap = await db.collection('users').doc(decoded.id).get();
        if (!userSnap.exists) {
            res.status(200).json({
                message: {
                    isAuthenticated: false,
                    user: null
                }
            });
            return
        }

        const user = userSnap.data() as any;
        const safeUser = {
            id: userSnap.id,
            email: user?.email,
            displayName: user?.displayName,
            role: user?.role,
            badges: user?.badges,
            level: user?.level ?? 1,
            xp: user?.xp ?? 0,
            grade: user?.grade ?? null,
            subjects: Array.isArray(user?.subjects) ? user?.subjects : undefined,
            provider: 'password'
        };

        res.status(200).json({
            message: {
                isAuthenticated: true,
                user: safeUser
            }
        });
        return
    } catch (error) {
        console.error('Session verification error:', error);
        res.status(200).json({
            message: {
                isAuthenticated: false,
                user: null
            }
        });
        return
    }
};

export const googleSignIn = async (req: Request, res: Response) => {
    try {
        const { idToken } = req.body as { idToken?: string };
        if (!idToken) {
            res.status(400).json({ message: 'Missing idToken' });
            return;
        }

        // Verify Firebase ID token
        const decoded = await auth.verifyIdToken(idToken);
        const { uid, email, name, picture, email_verified } = decoded as any;

        if (!uid || !email) {
            res.status(400).json({ message: 'Invalid token payload' });
            return;
        }

        // Ensure user profile exists in Firestore
        const userRef = db.collection('users').doc(uid);
        const snap = await userRef.get();

        if (!snap.exists) {
            const userProfile = {
                uid,
                email,
                displayName: name || '',
                photoURL: picture || '',
                role: 'student',
                badges: [],
                provider: 'google',
                isMailVerified: Boolean(email_verified),
                level: 1,
                xp: 0,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            };
            await userRef.set(userProfile);
        } else {
            // Merge minimal updates
            await userRef.set({
                email,
                displayName: name || admin.firestore.FieldValue.delete(),
                photoURL: picture || admin.firestore.FieldValue.delete(),
                provider: 'google',
                isMailVerified: Boolean(email_verified),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            }, { merge: true });
        }

        const jwtSecret = process.env.JWT_USER_SECRET as string | undefined;
        if (!jwtSecret) {
            res.status(500).json({ message: 'Server misconfiguration: missing JWT secret' });
            return;
        }

        const token = jwt.sign(
            { id: uid, email },
            jwtSecret,
            { expiresIn: '4d' }
        );

        const isDev = process.env.NODE_ENV === 'development';
        res.status(200)
            .cookie('token', token, {
                httpOnly: true,
                secure: !isDev,
                sameSite: isDev ? 'lax' : 'none',
                maxAge: 4 * 24 * 60 * 60 * 1000,
                path: '/',
            })
            .json({
                success: true,
                message: 'Google sign-in successful',
                user: { id: uid, email },
            });
        return;
    } catch (error) {
        console.error('Google sign-in error:', error);
        res.status(401).json({ message: 'Invalid Google credential' });
        return;
    }
};

// Onboarding: set grade and subjects for the current user, generating subjects if needed
export const onboarding = async (req: Request, res: Response) => {
    try {
        const userAuth = (req as any).user as { id: string; email: string } | undefined;
        if (!userAuth?.id) { res.status(401).json({ message: 'Unauthorized' }); return; }

        const schema = z.object({
            grade: z.number().min(1).max(12),
            subjects: z.array(z.object({ id: z.string(), name: z.string() })).optional()
        });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success) { res.status(400).json({ message: 'Validation failed', errors: parsed.error.flatten().fieldErrors }); return; }

        const { grade, subjects } = parsed.data;
        // Subject list: prefer provided subjects, else AI generated subjects as names
        const subjectNames: string[] = subjects && subjects.length > 0
            ? subjects.map(s => s.name)
            : await generateSubjectsForGrade(grade);

        // Helper to slugify names for doc IDs
        const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 64);

        const now = (admin as any).firestore.FieldValue.serverTimestamp();

        // Create subjects deterministically and collect ids
        const subjectIds: string[] = [];
        const subjectsBatch = db.batch();
        for (const name of subjectNames) {
            const sid = slugify(name);
            subjectIds.push(sid);
            const sref = db.collection('subjects').doc(sid);
            subjectsBatch.set(sref, { name, updatedAt: now }, { merge: true });
        }
        const userRef = db.collection('users').doc(userAuth.id);
        subjectsBatch.set(userRef, { grade, subjects: subjectIds, updatedAt: now }, { merge: true });
        await subjectsBatch.commit();

        // For each subject, create chapters (if not exist) and an AI mission per chapter
        for (const [idx, sid] of subjectIds.entries()) {
            const sname = subjectNames[idx];
            const chapters = await generateChaptersForSubject(grade, sname);
            for (const ch of chapters) {
                const chid = `${sid}-${slugify(ch.title)}-${ch.order}`;
                const chRef = db.collection('chapters').doc(chid);
                const chSnap = await chRef.get();
                if (!chSnap.exists) {
                    await chRef.set({ subjectId: sid, title: ch.title, order: ch.order, createdAt: now, updatedAt: now });
                }

                // Generate a mission for this chapter
                const mission = await generateMissionFromTopic({ topic: ch.title, gradeLevel: grade });
                // Normalize AI response
                const normalizedLesson = Array.isArray((mission as any).lessonContent)
                    ? (mission as any).lessonContent
                        .map((seg: any) => [seg?.header, seg?.text].filter(Boolean).join('\n\n'))
                        .join('\n\n')
                    : (mission as any).lessonContent || '';
                const normalizedQuiz = Array.isArray((mission as any).quizQuestions)
                    ? (mission as any).quizQuestions.map((q: any) => ({
                        question: q.questionText || q.question || '',
                        options: q.options || [],
                        answerIndex: (typeof q.correctAnswerIndex === 'number' ? q.correctAnswerIndex : q.answerIndex) ?? 0,
                    }))
                    : [];
                const normalizedGame = (mission as any).gameIdea ? {
                    title: (mission as any).gameIdea.title,
                    materials: (mission as any).gameIdea.materials || [],
                    steps: (mission as any).gameIdea.rules || (mission as any).gameIdea.steps || [],
                } : null;
                const mRef = db.collection('missions').doc();
                await mRef.set({
                    subjectId: sid,
                    chapterId: chid,
                    title: `${ch.title} Mission`,
                    description: `Learn ${ch.title} with a lesson, quiz, and a simple game.`,
                    lessonContent: normalizedLesson,
                    quizQuestions: normalizedQuiz,
                    gameIdea: normalizedGame,
                    gradeLevel: grade,
                    createdAt: now,
                    updatedAt: now,
                });
            }
        }

        res.json({ success: true, grade, subjects: subjectIds.map((id, i) => ({ id, name: subjectNames[i] })) });
    } catch (error: any) {
        console.error('Onboarding error:', error);
        res.status(500).json({ message: error?.message ?? 'Failed onboarding' });
    }
};

