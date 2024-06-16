import { Router } from "express";
import { coffeeData } from "../data/data.js";

const router = Router();

router.get('/', (req, res) => {
    res.send(coffeeData)
})

export default router;