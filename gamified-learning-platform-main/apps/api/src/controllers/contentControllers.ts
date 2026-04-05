import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { db } from '../config/firebase';
import { generateMissionFromTopic } from '../services/geminiService';
import { Request as ExpressRequest } from 'express';

export const listSubjects = async (_req: Request, res: Response) => {
    const snap = await db.collection('subjects').orderBy('name').get();
    const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
    res.json(items);
};

// Personalized subjects for current user
export const listSubjectsForUser = async (req: Request, res: Response) => {
    const user = (req as unknown as ExpressRequest & { user?: { id: string } }).user;
    if (!user?.id) { res.status(401).json({ message: 'Unauthorized' }); return; }

    const userDoc = await db.collection('users').doc(user.id).get();
    const data = userDoc.data() as any | undefined;
    const subjectIds: string[] = Array.isArray(data?.subjects) ? data!.subjects : [];
    if (subjectIds.length === 0) { res.json([]); return; }
    const snaps = await Promise.all(subjectIds.map(id => db.collection('subjects').doc(id).get()));
    const items = snaps.filter(s => s.exists).map(s => ({ id: s.id, ...(s.data() as any) }));
    // Sort by name for stable UI
    items.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    res.json(items);
};

export const getSubject = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const doc = await db.collection('subjects').doc(id).get();
    if (!doc.exists) { res.status(404).json({ message: 'Subject not found' }); return; }
    res.json({ id: doc.id, ...(doc.data() as any) });
};

export const listQuizzesBySubject = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const snap = await db.collection('quizzes').where('subjectId', '==', id).get();
    const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
    res.json(items);
};

export const getQuiz = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const doc = await db.collection('quizzes').doc(id).get();
    if (!doc.exists) { res.status(404).json({ message: 'Quiz not found' }); return; }
    res.json({ id: doc.id, ...(doc.data() as any) });
};

export const listMissionsBySubject = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const snap = await db.collection('missions').where('subjectId', '==', id).get();
    const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
    res.json(items);
};

// Chapters
export const listChaptersBySubject = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    // Avoid requiring a composite index by not ordering in the query. We'll sort in memory.
    const snap = await db.collection('chapters').where('subjectId', '==', id).get();
    const items = snap.docs
        .map(d => ({ id: d.id, ...(d.data() as any) }))
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    res.json(items);
};

export const getChapter = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const doc = await db.collection('chapters').doc(id).get();
    if (!doc.exists) { res.status(404).json({ message: 'Chapter not found' }); return; }
    res.json({ id: doc.id, ...(doc.data() as any) });
};

export const listMissionsByChapter = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const snap = await db.collection('missions').where('chapterId', '==', id).get();
    const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
    res.json(items);
};

export const adminGenerateDemoContent = async (_req: Request, res: Response) => {
    // Create demo subjects, quizzes, and missions if not present
    const batch = db.batch();
    const now = admin.firestore.FieldValue.serverTimestamp();

    const subjects = [
        { id: 'math', name: 'Mathematics' },
        { id: 'js', name: 'JavaScript' },
        { id: 'ts', name: 'TypeScript' },
    ];

    for (const s of subjects) {
        const ref = db.collection('subjects').doc(s.id);
        batch.set(ref, { name: s.name, createdAt: now }, { merge: true });
    }

    const quizzes = [
        { id: 'js-basics', title: 'JS Basics', subjectId: 'js', questions: [
            { id: 'q1', text: 'What is 2 + 2?', options: ['3','4','22','5'], answer: 1 },
            { id: 'q2', text: 'Which is a JS runtime?', options: ['V8','NPM','TCP','HTTP'], answer: 0 },
        ] },
        { id: 'ts-types', title: 'TS Types', subjectId: 'ts', questions: [
            { id: 'q1', text: 'Type for string?', options: ['String','string','str','text'], answer: 1 },
        ] },
    ];

    for (const q of quizzes) {
        const ref = db.collection('quizzes').doc(q.id);
        batch.set(ref, { title: q.title, subjectId: q.subjectId, questions: q.questions, createdAt: now }, { merge: true });
    }

    // Demo chapters
    const chapters = [
        { id: 'js-ch1', subjectId: 'js', title: 'JS Basics', order: 1 },
        { id: 'js-ch2', subjectId: 'js', title: 'Functions', order: 2 },
        { id: 'ts-ch1', subjectId: 'ts', title: 'Type System', order: 1 },
    ];

    for (const c of chapters) {
        const ref = db.collection('chapters').doc(c.id);
        batch.set(ref, { subjectId: c.subjectId, title: c.title, order: c.order, createdAt: now }, { merge: true });
    }

    const missions = [
        { id: 'js-m1', subjectId: 'js', chapterId: 'js-ch1', title: 'Variables Mission', description: 'Learn variables.' },
        { id: 'js-m2', subjectId: 'js', chapterId: 'js-ch2', title: 'Functions Mission', description: 'Learn functions.' },
        { id: 'ts-m1', subjectId: 'ts', chapterId: 'ts-ch1', title: 'Types Mission', description: 'Learn basic types.' },
    ];

    for (const m of missions) {
        const ref = db.collection('missions').doc(m.id);
        batch.set(ref, { subjectId: m.subjectId, chapterId: m.chapterId, title: m.title, description: m.description, createdAt: now }, { merge: true });
    }

    await batch.commit();
    res.json({ success: true });
};

export const generateMissionController = async (req: Request, res: Response) => {
    try {
        const { topic, gradeLevel, subjectId, chapterId } = req.body as { topic?: string; gradeLevel?: number; subjectId?: string; chapterId?: string };
        if (!topic || typeof topic !== 'string') {
            res.status(400).json({ message: 'Invalid topic' });
            return;
        }
        if (typeof gradeLevel !== 'number' || Number.isNaN(gradeLevel)) {
            res.status(400).json({ message: 'Invalid gradeLevel' });
            return;
        }
        if (subjectId && typeof subjectId !== 'string') { res.status(400).json({ message: 'Invalid subjectId' }); return; }
        if (chapterId && typeof chapterId !== 'string') { res.status(400).json({ message: 'Invalid chapterId' }); return; }

        const generated = await generateMissionFromTopic({ topic, gradeLevel });

        // Normalize response into our storage schema (supports both real AI schema and fallback)
        const normalizedLesson = Array.isArray((generated as any).lessonContent)
            ? (generated as any).lessonContent
                .map((seg: any) => [seg?.header, seg?.text].filter(Boolean).join('\n\n'))
                .join('\n\n')
            : (generated as any).lessonContent || '';
        const normalizedQuiz = Array.isArray((generated as any).quizQuestions)
            ? (generated as any).quizQuestions.map((q: any) => ({
                question: q.questionText || q.question || '',
                options: q.options || [],
                answerIndex: (typeof q.correctAnswerIndex === 'number' ? q.correctAnswerIndex : q.answerIndex) ?? 0,
            }))
            : [];
        const normalizedGame = (generated as any).gameIdea ? {
            title: (generated as any).gameIdea.title,
            materials: (generated as any).gameIdea.materials || [],
            steps: (generated as any).gameIdea.rules || (generated as any).gameIdea.steps || [],
        } : null;

        const missionRef = db.collection('missions').doc();
        await missionRef.set({
            title: `${topic} Mission`,
            description: `Learn ${topic} with a lesson, quiz, and a simple game.`,
            lessonContent: normalizedLesson,
            quizQuestions: normalizedQuiz,
            gameIdea: normalizedGame,
            topic,
            gradeLevel,
            subjectId: subjectId ?? null,
            chapterId: chapterId ?? null,
            createdAt: (admin as any).firestore.FieldValue.serverTimestamp()
        });

        res.json({ missionId: missionRef.id, data: generated });
    } catch (error: any) {
        res.status(500).json({ message: error?.message ?? 'Failed to generate mission' });
    }
};

export const getMissionById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const doc = await db.collection('missions').doc(id).get();
        if (!doc.exists) { res.status(404).json({ message: 'Mission not found' }); return; }
        res.json({ id: doc.id, ...(doc.data() as any) });
    } catch (error: any) {
        res.status(500).json({ message: error?.message ?? 'Failed to fetch mission' });
    }
};

export const listRecentMissions = async (_req: Request, res: Response) => {
    try {
        const snap = await db.collection('missions').orderBy('createdAt', 'desc').limit(20).get();
        const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
        res.json(items);
    } catch (error: any) {
        res.status(500).json({ message: error?.message ?? 'Failed to list missions' });
    }
};
