import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import applicationsRouter from "./applications";
import aiRouter from "./ai";
import digilockerRouter from "./digilocker";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(applicationsRouter);
router.use(aiRouter);
router.use(digilockerRouter);

export default router;
