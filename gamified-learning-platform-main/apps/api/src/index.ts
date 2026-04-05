import './config/firebase'; 
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PORT } from './config/envVariables';
import { UserRouter } from './routes/userRoutes';
import passport from 'passport';
import './oauth/passport';
import { OauthRouter } from './oauth/main';
import { ContentRouter } from './routes/contentRoutes';
import { CommunityRouter } from './routes/communityRoutes';

const app = express();

const corsOptions = {
    origin: [
        'http://localhost:3000'
    ],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

app.use('/api/v1/auth/user', UserRouter);
app.use('/api/v1/content', ContentRouter);
app.use('/api/v1/community', CommunityRouter);
app.use('/auth', OauthRouter);

// Health check route
app.get('/', (req, res) => {
    res.json({ message: 'Hello from the Gamified Learning API!, the server is up and running!' });
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`Backend is Running at http://localhost:${PORT}`);
});