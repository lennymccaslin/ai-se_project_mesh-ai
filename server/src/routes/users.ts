import { Router } from "express";
import { getCurrentUser } from "../controllers/auth.js";
import { auth } from "../middleware/auth.js";

const usersRouter = Router();

usersRouter.use(auth);
usersRouter.get('/me', getCurrentUser);

export { usersRouter };