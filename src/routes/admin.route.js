import express from "express";
import { createAdmin, loginAdmin, logout } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/create",createAdmin);
router.post("/login",loginAdmin);
router.post("/logout",logout)


export default router;