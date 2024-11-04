import {Request, RequestHandler, Response} from "express";
import NoteModel from "../models/note";
import app from "../app";

export const getNotes: RequestHandler = async (req: Request, res: Response) => {
    try {
        const notes = await NoteModel.find().exec();
        res.status(200).json(notes);
    } catch (e) {
        res.status(500).json({message: e.message});
    }
}

export const getNote: RequestHandler = async (req, res) => {
    // const  noteId  = req.params.noteId;
    const { noteId } = req.params;
    try {
        const existNote = await NoteModel.findById(noteId).exec();
        res.status(200).json(existNote);
    } catch (e) {
        res.status(404).json({message: "Note not found"});
    }
}

export const createNote: RequestHandler = async (req, res) => {
    const {title, text} = req.body
    try {
        const newNote = await NoteModel.create({
            title: title,
            text: text,
        });
        await newNote.save();
        res.status(201).json(newNote);
    } catch (e) {
        res.status(400).json({message: e.message});
    }
}