import  {Request, RequestHandler, Response, NextFunction} from "express";
import NoteModel from "../models/note";
import createHttpError from "http-errors";
import mongoose from "mongoose";

export const getNotes:RequestHandler = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const notes = await NoteModel.find().exec();
        if (!notes){
            throw createHttpError(404,"No notes found")
        }
        res.status(200).json(notes);
    } catch (error) {
        next(error)
    }
}

export const getNote: RequestHandler = async (req: Request, res: Response,next:NextFunction) => {
    // const  noteId  = req.params.noteId;
    const {noteId} = req.params;       //this is very importanting name (noteId name)
    try {
        //check whether id is a mongoose id
        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400, "Invalid note id")
        }

        const note = await NoteModel.findById(noteId).exec();
        if (!note){
            throw createHttpError(404,"note not found")
        }

        res.status(200).json(note);
    } catch (error) {
        next(error)
    }
}

export const createNote: RequestHandler = async (req: Request, res: Response,next:NextFunction) => {
    const {title, text} = req.body
    try {
        if (!title){
            throw createHttpError(404,"Note must have a title")
        }

        const newNote = await NoteModel.create({
            title: title,
            text: text,
        });
        await newNote.save();
        res.status(201).json(newNote);
    } catch (error) {
       next(error)
    }
}

export const updateNote: RequestHandler = async (req:Request, res:Response,next:NextFunction) => {
    const {noteId} = req.params;
     const {title, text} = req.body;
    try {
        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400, "Invalid note id")
        }
        let note = await NoteModel.findById(noteId).exec();
        if (!note) {
            throw createHttpError(404,"note not found");
        }
        note.title = title;
        note.text = text;
        const updatedNote = await note?.save();
        res.status(200).json(updatedNote)
    } catch (error) {
        next(error)
    }
}

export const deleteNote=async (req:Request, res:Response,next:NextFunction)=> {
    const {noteId} = req.params;
    try {
        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400, "Invalid note id")
        }
        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            throw createHttpError(404,"note not found")
        }
        await note?.deleteOne();
        res.status(204).json({message: "Note deleted successfully"});
    } catch (error) {
        next(error);
    }
};
