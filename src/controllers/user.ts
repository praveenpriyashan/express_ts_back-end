import {NextFunction, Request, RequestHandler, Response} from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user"
import bcrypt from 'bcrypt';


export const getAuthenticatedUser:RequestHandler = async (req:Request,res:Response,next:NextFunction)=>{
    const authenticatedUserId=req.session.userId
    try{
        if (!authenticatedUserId){
            throw createHttpError(401, "user not authenticated");
        }
        const user=await UserModel.findById(authenticatedUserId).select("+email").exec()
        res.status(201).json(user)
    }catch (e) {
        next(e)
    }
}


export const signUp: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    // in  this,we can get Password like this,  const {username, email,passwordRow} = req.body;
    //passwordRow naminma fetch krla gannva.ethkota ui eke thiyennet passwordRow vidihata.api gannet passwordRow vidihata
    const {username, email} = req.body;
    const passwordRow = req.body.password;

    try {
        if (!username || !email || !passwordRow) {
            throw createHttpError(400, "parameters required");
        }
        const existingUsername = await UserModel.findOne({username: username});
        if (existingUsername) {
            throw createHttpError(409, "username already exists");
        }
        const existEmail = await UserModel.findOne({email: email});
        if (existEmail) {
            throw createHttpError(409, "email already exists");
        }
        const hashedPassword = await bcrypt.hash(passwordRow, 10)
        const newUser = await UserModel.create({
            username: username,
            email: email,
            password: hashedPassword,
        })
        req.session.userId = newUser.id
        res.status(201).json(newUser);

    } catch (e) {
        next(e)
    }
}

export const login: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const username = req.body.username
    const password = req.body.password

    try {
        if (!username || !password) {
            throw createHttpError(400, "Username and password are required")
        }
        const user = await UserModel.findOne({username: username}).select("+password +email").exec()
        if (!user) {
            throw createHttpError(401, "Invalid username or password")
        }
        const passwordMatch: boolean = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            throw createHttpError(401, "Invalid username or password")
        }
        req.session.userId=user.id
         res.status(201).json(user)
    } catch (e) {
        next(e)
    }
}