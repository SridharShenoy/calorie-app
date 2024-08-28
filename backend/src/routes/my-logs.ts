import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import Log from "../models/log";
import User from "../models/user";
import multer from 'multer';

const upload = multer();
const router = express.Router();

router.get("/all", verifyToken,
  async (req: Request, res: Response) => {
      try {
        const userId = req.userId;
        const response = await Log.find({ userId }).sort({ logDate: -1 });
        res.status(200).json(response)
      } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving logs' });
      }
  }
);

router.post("/get-log/:date", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const dayString = req.params.date;

    if (!dayString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return res.status(400).json({ message: 'Invalid date format' });
    }
    const date = new Date();
    date.setHours(0,0,0,0);

    const todayString = date.toISOString().split('T')[0];
    const user = await User.findById(userId);
    const goalCal = user?.currCalGoal;

    let response = await Log.findOne({ userId, logDate: dayString });
    if (!response) {
      if (todayString === dayString) {
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        response = new Log({ userId, logDate: todayString, goalCal: goalCal, });
        await response.save();
      } else {
        return res.status(404).json({ message: 'Log not found' });
      }
    }
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while retrieving logs' });
  }
});


router.post("/save/:date", upload.none(), verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { weight, journalEntry, logItems } = req.body;
    const logDate = req.params.date;

    if (!logDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return res.status(400).json({ message: 'Invalid date format' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(500).json({ message: 'Something went wrong' })
    }
    const goalCal = user.currCalGoal;
    let parsedLogItems;
    try {
      parsedLogItems = logItems ? JSON.parse(logItems) : [];
    } catch (error) {
      return res.status(400).json({ message: 'Invalid log items format' });
    }
    let currCal: number = 0;
    parsedLogItems.forEach((item: { name: string; calories: number; }) => {
      currCal = Number(item.calories) + currCal;
    });

    let existingLog = await Log.findOne({ userId, logDate });
    
    if (existingLog) {
      existingLog.weight = weight;
      existingLog.journalEntry = journalEntry;
      existingLog.logItems = parsedLogItems;
      existingLog.currCal = currCal;
      existingLog.goalCal = goalCal;
      await existingLog.save();
    } else {
      const newLog = new Log({
        userId: req.userId,
        logDate: logDate,
        weight,
        journalEntry,
        logItems: parsedLogItems,
        currCal,
        goalCal,
      });
      await newLog.save();
    }

    res.status(200).json({ message: "Log saved successfully" });
  } catch (error) {
    console.error('Error saving log:', error);
    res.status(500).json({ error: 'Failed to save log' });
  }
});



export default router;