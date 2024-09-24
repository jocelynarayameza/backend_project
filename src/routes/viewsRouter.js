import { Router } from "express";
import { __dirname } from '../utils.js';
import ProductManager from "../daos/filesystem/manager.js";
const productManager = new ProductManager(__dirname + "/data/nuevoProducto.json");
const router = Router();
import * as controller from "../controllers/chatController.js"
import * as control from "../controllers/userController.js"

router.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('home', { products })
});

router.get('/realtimeproducts', async (req, res) => {
  try {
    const user = req.user;
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { user, products });
  } catch (error) {
    console.error("Error en realtimeproducts:", error);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/chats", controller.getAll);

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/profile-github", (req, res) => {
  console.log("req.user", req.user);
  const user = req.user.toObject();
  res.render("profile", { user });
});

export default router; 