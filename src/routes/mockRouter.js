import { Router } from "express";
import { getProducts } from "../controllers/mockController.js";

const router = Router();

router.get("/", getProducts);

export default router;

