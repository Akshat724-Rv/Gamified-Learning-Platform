import { Router } from 'express';
import { UserAuth } from '../middlewares/userAuthentication';
import { createPost, getAllPosts, getPostById, addReplyToPost, getRepliesForPost, getCloudinarySignature, toggleLikeOnPost, toggleDownvoteOnPost } from '../controllers/communityControllers';

export const CommunityRouter = Router();

// Posts
CommunityRouter.get('/posts', UserAuth, getAllPosts);
CommunityRouter.get('/posts/:postId', UserAuth, getPostById);
CommunityRouter.post('/posts', UserAuth, createPost);
CommunityRouter.post('/posts/:postId/upvote', UserAuth, toggleLikeOnPost);
CommunityRouter.post('/posts/:postId/downvote', UserAuth, toggleDownvoteOnPost);

// Replies
CommunityRouter.get('/posts/:postId/replies', UserAuth, getRepliesForPost);
CommunityRouter.post('/posts/:postId/replies', UserAuth, addReplyToPost);

// Cloudinary signature for client-side direct upload
CommunityRouter.get('/cloudinary/signature', UserAuth, getCloudinarySignature);


