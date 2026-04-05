import { Router } from "express";
import { signup, signin, session, logout, googleSignIn, onboarding } from "../controllers/userControllers";
import { UserAuth } from "../middlewares/userAuthentication";

export const UserRouter = Router();


UserRouter.post("/signup" , signup);
UserRouter.post("/signin" , signin);
UserRouter.post("/signin/google" , googleSignIn);
UserRouter.get("/session" , UserAuth, session);
UserRouter.post("/logout" , logout);
UserRouter.post("/onboarding", UserAuth, onboarding);