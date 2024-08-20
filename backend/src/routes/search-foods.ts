import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import axios from "axios";

const router = express.Router();

type FoodItem =  {
    description: string;
    foodCategory: string;
    servingSize: number;
    servingSizeUnit: string;
    brandName: string;
    foodNutrients: Array<{
      nutrientId: number;
      nutrientName: string;
      unitName: string;
      value: number;
    }>;
  }

router.get(
    "/:query",
    verifyToken,
    async (req: Request, res: Response) => {
        try {
            const response = await axios.get(`https://api.nal.usda.gov/fdc/v1/foods/search`, {
                params: {
                  api_key: process.env.USDA_API_KEY,
                  query: req.params.query,
                  pageSize: 10,
                },
              });
            const foods: FoodItem[] = response.data.foods;
            res.status(200).json(foods);
        } catch (error) {
            console.error('Error fetching data from USDA API:', error);
            res.status(500).json({ error: 'Failed to fetch data from USDA API' });
        }
        
    }
  );

export default router;