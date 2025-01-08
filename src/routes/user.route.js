import express from "express"
import { contactUs, deleteUser, getUsers } from "../controllers/user.controller.js";
import {adminOnly, protectRoute} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/contact", contactUs);
router.get("/all", protectRoute,adminOnly,getUsers);
router.delete("/:id", protectRoute,adminOnly,deleteUser);

export default router;
