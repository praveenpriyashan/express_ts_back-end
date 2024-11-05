import {Request, RequestHandler, Response} from "express";
import NoteModel from "../models/note";
import app from "../app";
import {text} from "node:stream/consumers";

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
    const {noteId} = req.params;
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

export const deleteNote: RequestHandler<DeleteNoteParams> = async (req, res) => {
    const { noteId } = req.params;

    try {
        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            res.status(404).json({ message: "Note not found" });
        }

        await note?.deleteOne();
        res.status(200).json({ message: "Note deleted successfully" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};