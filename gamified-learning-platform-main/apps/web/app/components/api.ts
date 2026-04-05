"use client";
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
});

export async function getSession() {
  const { data } = await api.get("/api/v1/auth/user/session");
  return data as { message: { isAuthenticated: boolean; user: any } };
}

export async function signout() {
  await api.post("/api/v1/auth/user/logout");
}

// --- Community ---
export async function listPosts() {
  const { data } = await api.get("/api/v1/community/posts");
  return data as any[];
}

export async function createPostApi(payload: {
  authorId: string;
  authorName?: string;
  displayName?: string;
  content: string;
  attachmentUrl?: string;
  attachmentType?: string;
  attachmentPublicId?: string;
  subjectTag?: string;
}) {
  const { data } = await api.post("/api/v1/community/posts", payload);
  return data as { message: string; postId: string };
}

export async function getPostById(postId: string) {
  const { data } = await api.get(`/api/v1/community/posts/${postId}`);
  return data as any;
}

export async function upvote(postId: string, userId: string) {
  const { data } = await api.post(`/api/v1/community/posts/${postId}/upvote`, { userId });
  return data as { message: string };
}

export async function downvote(postId: string, userId: string) {
  const { data } = await api.post(`/api/v1/community/posts/${postId}/downvote`, { userId });
  return data as { message: string };
}

export async function listReplies(postId: string) {
  const { data } = await api.get(`/api/v1/community/posts/${postId}/replies`);
  return data as any[];
}

export async function addReply(postId: string, payload: { authorId: string; authorName?: string; content: string }) {
  const { data } = await api.post(`/api/v1/community/posts/${postId}/replies`, payload);
  return data as { message: string };
}

export async function getCloudinarySignatureApi() {
  const { data } = await api.get('/api/v1/community/cloudinary/signature');
  return data as { signature: string; timestamp: number };
}


