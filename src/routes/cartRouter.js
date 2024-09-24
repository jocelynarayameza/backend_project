import { Router } from "express";
import * as controller from "../controllers/cartController.js"
const router = Router();
import {__dirname} from '../utils.js'
import { authUser } from "../middlewares/auth.js";


router.post("/", authUser, controller.create);

router.get("/",  controller.getAll);

router.get("/:cid", controller.getById);

router.post("/:cid/productos/:id", authUser, controller.saveToCart);

router.post("/:cid/purchase", controller.purchaseCartControllers );

router.delete("/:cid", authUser, controller.removeAllProductsFromCart);

router.delete("/:cid/productos/:id", authUser, controller.deleteProductFromCart);

router.put("/:cid", authUser, controller.updateCart);

router.put("/:cid/productos/:id", authUser, controller.updateProductQuantity);



export default router