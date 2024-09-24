import { Router } from "express";
import {__dirname} from '../utils.js'
import { productValidator } from "../middlewares/productValidator.js";
import * as controller from "../controllers/productController.js"
const router = Router();
import { authAdmin } from "../middlewares/auth.js";


router.get("/", controller.getProducts);

router.get("/:id", controller.getProductsById);

router.post("/", authAdmin, productValidator, controller.addProduct); 

router.put("/:id", authAdmin, controller.updateProduct);

router.delete("/:id", authAdmin,  controller.deleteProduct);

export default router;