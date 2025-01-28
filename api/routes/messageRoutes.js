import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getConversation, sendMessage } from "../controllers/messageController.js";

const router = express.Router();

router.use(protectRoute);

router.post('/send', sendMessage)
router.get("/conversation/:userId", getConversation)


export default router;