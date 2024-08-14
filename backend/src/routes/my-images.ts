import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";
import { UserType } from "../models/user";
import User from "../models/user";

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  });

const router = express.Router();

router.get(
    "/progress-pictures",
    verifyToken,
    async (req: Request, res: Response) => {
        try {
            // Assuming `verifyToken` adds `userId` to `req.user`
            const userId = req.userId;

            // Find the user by ID
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).send('User not found');
            }

            // Respond with the user's progress pictures
            res.status(200).json({ ProgressPictures: user.ProgressPictures });
        } catch (error) {
            console.error('Error fetching progress pictures:', error);
            res.status(500).send('Server error');
        }
    }
);

router.delete('/progress-pictures/:index', verifyToken, async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const index = parseInt(req.params.index, 10);

        if (isNaN(index)) {
            console.log('Invalid index:', req.params.index);
            return res.status(400).send('Invalid index');
        }

        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found:', userId);
            return res.status(404).send('User not found');
        }

        if (index < 0 || index >= user.ProgressPictures.length) {
            console.log('Index out of bounds:', index);
            return res.status(400).send('Index out of bounds');
        }

        // Remove the image URL from the user's ProgressPictures array
        user.ProgressPictures.splice(index, 1);
        await user.save();

        res.status(200).send('Image removed successfully');
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).send('Server error');
    }
});



router.post(
    "/",
    verifyToken,
    upload.array("imageFiles", 6),
    async (req: Request, res: Response) => {
        try {
          // Assuming `verifyToken` adds `userId` to `req.user`
          const userId = req.userId; 
          const imageFiles = req.files as Express.Multer.File[];
          
          // Construct URLs for the uploaded files
          const fileUrls = await uploadImages(imageFiles);
    
          // Find the user by ID and update their `ProgressPictures` array
          const user = await User.findById(userId);
          if (!user) {
            return res.status(404).send('User not found');
          }

          // Append new image URLs to the user's `ProgressPictures` array
          user.ProgressPictures = user.ProgressPictures.concat(fileUrls);

          // Save the updated user document to the database
          await user.save();

          // Respond with the updated `ProgressPictures`
          res.status(200).json({ ProgPicUrls: user.ProgressPictures });
        } catch (error) {
          console.error('Error uploading images:', error);
          res.status(500).send('Server error');
        }
    }
);

async function uploadImages(imageFiles: Express.Multer.File[]) {
    const uploadPromises = imageFiles.map(async (image) => {
      const b64 = Buffer.from(image.buffer).toString("base64");
      let dataURI = "data:" + image.mimetype + ";base64," + b64;
      const res = await cloudinary.v2.uploader.upload(dataURI);
      return res.url;
    });
  
    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
  };

export default router;