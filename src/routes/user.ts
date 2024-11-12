import express   from "express";
import {getAuthenticatedUser, login, signUp} from "../controllers/user";
const router=express.Router();

router.get('/',getAuthenticatedUser)
router.post('/signup',signUp)
router.post('/login',login)

export default router