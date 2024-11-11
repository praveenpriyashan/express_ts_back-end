import {NextFunction, Request, RequestHandler, Response} from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user"
import bcrypt from 'bcrypt';

export const signUp: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const {username, email, passwordRow} = req.body;

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
        res.status(201).json(newUser);

    } catch (e) {
        next(e)
    }
}