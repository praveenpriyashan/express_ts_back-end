import express  from "express";
import {createNote, deleteNote, getNote, getNotes, updateNote} from '../controllers/notes'
const router=express.Router();

router.get('/',getNotes)
router.post('/',createNote)
router.get('/:noteId',getNote)
router.patch('/:noteId',updateNote)
router.delete('/:noteId',deleteNote)

export default router;
