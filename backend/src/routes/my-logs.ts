import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";
import { logType } from "../models/log";
import Log from "../models/log";


const router = express.Router();


router.post(
    "/",
    verifyToken,
    async (req: Request, res: Response) => {
      
    }
  );

export default router;