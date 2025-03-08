import express from "express";
import { deleteUserById, editUserById, getAllUser, getUserById, getUserCount, createUser } from "../controllers/userModule/user.controller.js";

const router = express.Router();

router.post('/create', createUser);
router.get('/getAllUser', getAllUser);
router.get("/getUserById/:userId", getUserById);
router.put('/editUserById/:userId', editUserById);
router.delete('/deleteUserById/:userId', deleteUserById);
router.get('/getUserCount', getUserCount)

export default router;
