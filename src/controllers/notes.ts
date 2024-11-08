import e, {Request, RequestHandler, Response, NextFunction} from "express";
import NoteModel from "../models/note";
import app from "../app";
import {text} from "node:stream/consumers";
import createHttpError from "http-errors";
import {throws} from "node:assert";
import mongoose from "mongoose";

export const getNotes:RequestHandler = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const notes = await NoteModel.find().exec();
        res.status(200).json(notes);
    } catch (error) {
        next(error)
    }
}

export const getNote: RequestHandler = async (req: Request, res: Response,next:NextFunction) => {
    // const  noteId  = req.params.noteId;
    const {noteId} = req.params;
    try {
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

// interface UpdateNoteParams {
//     noteId: string;
// }
//
// interface UpdateNoteBody {
//     title?: string;
//     text?: string;
// }

// export const updateNote: RequestHandler<UpdateNoteParams,unknown,UpdateNoteBody,unknown> = async (req, res) => {
//     const {noteId} = req.params;
 //     const {newTitle, newText} = req.body;
//     try {
//         let note = await NoteModel.findById(noteId).exec();
//         if (!note) {
//             res.status(404).send("note not found");
//         }
//
//         note.title = newText;
//         note.text = newTitle;
//         const updatedNote = await note?.save();
//         res.status(200).send(updatedNote)
//     } catch (e) {
//         res.status(400).json({message: e.message});
//     }
// }


interface DeleteNoteParams {
    noteId: string;
}

export const deleteNote: (req: e.Request, res: e.Response) => Promise<void> = async (req: Request, res: Response) => {
    const {noteId} = req.params;
    try {
        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            res.status(404).json({message: "Note not found"});
        }
        await note?.deleteOne();
        res.status(200).json({message: "Note deleted successfully"});
    } catch (e) {
        res.status(500).json({message: e.message});
    }
};
