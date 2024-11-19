import express   from "express";
import {getAuthenticatedUser, login, logout, signUp} from "../controllers/user";
const router=express.Router();

router.get('/',getAuthenticatedUser)
router.post('/signup',signUp)
router.post('/login',login)
router.get('/logout',logout)


export default router
