import { Router } from 'express';
import { listSubjects, listSubjectsForUser, getSubject, listQuizzesBySubject, getQuiz, listMissionsBySubject, adminGenerateDemoContent, generateMissionController, getMissionById, listRecentMissions, listChaptersBySubject, getChapter, listMissionsByChapter } from '../controllers/contentControllers';
import { AdminAuth } from '../middlewares/adminAuth';
import { UserAuth } from '../middlewares/userAuthentication';

export const ContentRouter = Router();

ContentRouter.get('/subjects', listSubjects);
ContentRouter.get('/me/subjects', UserAuth, listSubjectsForUser);
ContentRouter.get('/subjects/:id', getSubject);
ContentRouter.get('/subjects/:id/quizzes', listQuizzesBySubject);
ContentRouter.get('/subjects/:id/missions', listMissionsBySubject);
ContentRouter.get('/subjects/:id/chapters', listChaptersBySubject);
ContentRouter.get('/chapters/:id', getChapter);
ContentRouter.get('/chapters/:id/missions', listMissionsByChapter);
ContentRouter.get('/quizzes/:id', getQuiz);
ContentRouter.get('/missions', listRecentMissions);
ContentRouter.get('/missions/:id', getMissionById);

// Admin
ContentRouter.post('/admin/generate', AdminAuth, adminGenerateDemoContent);
ContentRouter.post('/generate-mission', AdminAuth, generateMissionController);
