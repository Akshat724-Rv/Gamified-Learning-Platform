import { Request, Response } from 'express';
import { db } from '../config/firebase';
import * as admin from 'firebase-admin';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary (ensure you have these in your .env file)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

// --- POSTS ---
const pruneUndefined = (obj: Record<string, unknown>) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));

// export const createPost = async (req: Request, res: Response) => {
//     try {
//         const authedUser = (req as any).user as { id: string; email?: string; name?: string; displayName?: string; username?: string } | undefined;
//         const { authorId, authorName, displayName, content, attachmentUrl, attachmentType, subjectTag } = req.body as Record<string, unknown>;
//         const resolvedAuthorId = typeof authorId === 'string' ? authorId : authedUser?.id;
//         const resolvedDisplayName = typeof displayName === 'string'
//             ? displayName
//             : (typeof authorName === 'string' ? authorName : (authedUser?.displayName || authedUser?.name || authedUser?.username || authedUser?.email));
//         if (typeof resolvedAuthorId !== 'string' || typeof content !== 'string' || content.trim().length === 0) {
//             return res.status(400).json({ error: 'Author and content are required.' });
//         }

//         const postData = pruneUndefined({
//             authorId: resolvedAuthorId,
//             displayName: resolvedDisplayName,
//             authorName: resolvedDisplayName,
//             content,
//             attachmentUrl: typeof attachmentUrl === 'string' ? attachmentUrl : undefined,
//             attachmentType: typeof attachmentType === 'string' ? attachmentType : undefined,
//             subjectTag: typeof subjectTag === 'string' ? subjectTag : undefined,
//             upvoteCount: 0,
//             downvoteCount: 0,
//             replyCount: 0,
//             createdAt: admin.firestore.FieldValue.serverTimestamp(),
//         });

//         const newPostRef = await db.collection('posts').add(postData);
//         res.status(201).json({ message: 'Post created!', postId: newPostRef.id });

//     } catch (error: any) {
//         res.status(500).json({ error: 'Failed to create post.', details: error.message });
//     }
// };

export const createPost = async (req: Request, res: Response) => {
    try {
        const authedUser = (req as any).user as { id: string; email?: string; name?: string; displayName?: string; username?: string } | undefined;
        const { authorId, authorName, displayName, content, attachmentUrl, attachmentType, subjectTag, attachmentPublicId } = req.body as Record<string, unknown>;
        
        const resolvedAuthorId = typeof authorId === 'string' ? authorId : authedUser?.id;
        if (typeof resolvedAuthorId !== 'string' || typeof content !== 'string' || content.trim().length === 0) {
            return res.status(400).json({ error: 'Author and content are required.' });
        }

        // Fetch user details from Firestore to get correct name and photo
        const userDoc = await db.collection('users').doc(resolvedAuthorId).get();
        let authorDisplayName = 'Anonymous';
        let authorPhotoURL = null;
        
        if (userDoc.exists) {
            const userData = userDoc.data();
            authorDisplayName = userData?.displayName || userData?.name || userData?.username || userData?.email || 'Anonymous';
            authorPhotoURL = userData?.photoURL || null;
        } else {
            // Fallback to request data or auth user data
            authorDisplayName = typeof displayName === 'string' ? displayName 
                : (typeof authorName === 'string' ? authorName 
                : (authedUser?.displayName || authedUser?.name || authedUser?.username || authedUser?.email || 'Anonymous'));
        }

        const postData = pruneUndefined({
            authorId: resolvedAuthorId,
            authorDisplayName,
            authorPhotoURL,
            content,
            attachmentUrl: typeof attachmentUrl === 'string' ? attachmentUrl : undefined,
            attachmentType: typeof attachmentType === 'string' ? attachmentType : undefined,
            attachmentPublicId: typeof attachmentPublicId === 'string' ? attachmentPublicId : undefined,
            subjectTag: typeof subjectTag === 'string' ? subjectTag : undefined,
            upvoteCount: 0,
            downvoteCount: 0,
            replyCount: 0,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        const newPostRef = await db.collection('posts').add(postData);
        res.status(201).json({ message: 'Post created!', postId: newPostRef.id });

    } catch (error: any) {
        res.status(500).json({ error: 'Failed to create post.', details: error.message });
    }
};


// export const getAllPosts = async (req: Request, res: Response) => {
//     try {
//         const postsSnapshot = await db.collection('posts').orderBy('createdAt', 'desc').limit(20).get();
//         const posts = postsSnapshot.docs.map(doc => {
//             const data = doc.data() as any;
//             const displayName = data.displayName || data.authorName;
//             return { id: doc.id, displayName, ...data };
//         });
//         res.status(200).json(posts);
//     } catch (error: any) {
//         res.status(500).json({ error: 'Failed to fetch posts.' });
//     }
// };

export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const postsSnapshot = await db.collection('posts').orderBy('createdAt', 'desc').limit(20).get();
        const posts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(posts);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch posts.' });
    }
};

export const getPostById = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const postDoc = await db.collection('posts').doc(postId).get();
        if (!postDoc.exists) {
            return res.status(404).json({ error: 'Post not found.' });
        }
        res.status(200).json({ id: postDoc.id, ...postDoc.data() });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch post.' });
    }
};

// --- REPLIES ---
export const addReplyToPost = async (req: Request, res: Response) => {
    const { postId } = req.params;
    const authedUser = (req as any).user as { id: string; email?: string; name?: string; displayName?: string; username?: string } | undefined;
    const { authorId, authorName, displayName, content } = req.body as Record<string, unknown>;

    try {
        const postRef = db.collection('posts').doc(postId);
        const replyRef = db.collection('replies').doc();

        await db.runTransaction(async (transaction) => {
            const postDoc = await transaction.get(postRef);
            if (!postDoc.exists) {
                throw new Error("Post not found!");
            }
            
            const resolvedAuthorId = typeof authorId === 'string' ? authorId : authedUser?.id;
            if (typeof resolvedAuthorId !== 'string' || typeof content !== 'string' || content.trim().length === 0) {
                throw new Error('Invalid author or content');
            }

            // Fetch user details for reply author
            const userDoc = await db.collection('users').doc(resolvedAuthorId).get();
            let authorDisplayName = 'Anonymous';
            let authorPhotoURL = null;
            
            if (userDoc.exists) {
                const userData = userDoc.data();
                authorDisplayName = userData?.displayName || userData?.name || userData?.username || userData?.email || 'Anonymous';
                authorPhotoURL = userData?.photoURL || null;
            } else {
                authorDisplayName = typeof displayName === 'string' ? displayName 
                    : (typeof authorName === 'string' ? authorName 
                    : (authedUser?.displayName || authedUser?.name || authedUser?.username || authedUser?.email || 'Anonymous'));
            }

            transaction.set(replyRef, pruneUndefined({
                postId,
                authorId: resolvedAuthorId,
                authorDisplayName,
                authorPhotoURL,
                content,
                isBestAnswer: false,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            }));
            
            transaction.update(postRef, { replyCount: admin.firestore.FieldValue.increment(1) });
        });

        res.status(201).json({ message: 'Reply added successfully!' });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to add reply.', details: error.message });
    }
};

export const getRepliesForPost = async (req: Request, res: Response) => {
    const { postId } = req.params;
    try {
        const repliesSnapshot = await db
            .collection('replies')
            .where('postId', '==', postId)
            .orderBy('createdAt', 'asc')
            .get();
        const replies = repliesSnapshot.docs.map(doc => {
            const data = doc.data() as any;
            const displayName = data.displayName || data.authorName;
            return { id: doc.id, displayName, ...data };
        });
        res.status(200).json(replies);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch replies.', details: error.message });
    }
};

// --- LIKES ---
export const toggleLikeOnPost = async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { userId } = req.body;
    if (!userId) {
        res.status(400).json({ error: 'userId is required' });
        return;
    }
    try {
        const postRef = db.collection('posts').doc(postId);
        const likeDocId = `${postId}_${userId}`;
        const likeRef = db.collection('postVotes').doc(likeDocId);

        await db.runTransaction(async (trx) => {
            const [postSnap, likeSnap] = await Promise.all([
                trx.get(postRef),
                trx.get(likeRef)
            ]);
            if (!postSnap.exists) {
                throw new Error('Post not found');
            }

            if (likeSnap.exists) {
                trx.delete(likeRef);
                trx.update(postRef, { upvoteCount: admin.firestore.FieldValue.increment(-1) });
            } else {
                trx.set(likeRef, { postId, userId, type: 'upvote', createdAt: admin.firestore.FieldValue.serverTimestamp() });
                trx.update(postRef, { upvoteCount: admin.firestore.FieldValue.increment(1) });
            }
        });

        res.status(200).json({ message: 'Toggled like' });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to toggle like.', details: error.message });
    }
};

export const toggleDownvoteOnPost = async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { userId } = req.body;
    if (!userId) {
        res.status(400).json({ error: 'userId is required' });
        return;
    }
    try {
        const postRef = db.collection('posts').doc(postId);
        const voteDocId = `${postId}_${userId}_down`;
        const voteRef = db.collection('postVotes').doc(voteDocId);

        await db.runTransaction(async (trx) => {
            const [postSnap, voteSnap] = await Promise.all([
                trx.get(postRef),
                trx.get(voteRef)
            ]);
            if (!postSnap.exists) {
                throw new Error('Post not found');
            }

            if (voteSnap.exists) {
                trx.delete(voteRef);
                trx.update(postRef, { downvoteCount: admin.firestore.FieldValue.increment(-1) });
            } else {
                trx.set(voteRef, { postId, userId, type: 'downvote', createdAt: admin.firestore.FieldValue.serverTimestamp() });
                trx.update(postRef, { downvoteCount: admin.firestore.FieldValue.increment(1) });
            }
        });

        res.status(200).json({ message: 'Toggled downvote' });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to toggle downvote.', details: error.message });
    }
};

// --- SECURE UPLOAD URL GENERATOR ---
export const getCloudinarySignature = (req: Request, res: Response) => {
    const timestamp = Math.round((new Date).getTime() / 1000);

    const folder = typeof req.query.folder === 'string' ? req.query.folder : undefined;
    const upload_preset = typeof req.query.upload_preset === 'string' ? req.query.upload_preset : undefined;
    const params_to_sign: Record<string, string | number> = { timestamp };
    if (folder) params_to_sign.folder = folder;
    if (upload_preset) params_to_sign.upload_preset = upload_preset;

    try {
        const signature = cloudinary.utils.api_sign_request(params_to_sign, process.env.CLOUDINARY_API_SECRET!);
        res.status(200).json({ signature, timestamp, folder, upload_preset });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to generate upload signature.', details: error.message });
    }
};
