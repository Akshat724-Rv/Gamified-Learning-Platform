import { config } from "dotenv";
config();

export const PORT = process.env.PORT || 3001;
export const JWT_USER_SECRET = process.env.JWT_USER_SECRET as string;
export const FRONTEND_URL = process.env.FRONTEND_URL as string;
export const BASE_URL = process.env.BASE_URL as string;

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Gemini API Key from your environment (set GEMINI_API_KEY in .env)
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string | undefined;