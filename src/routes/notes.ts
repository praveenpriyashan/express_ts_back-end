import express  from "express";
import {createNote, getNote, getNotes} from '../controllers/notes'
const router=express.Router();

router.get('/',getNotes)
router.post('/',createNote)
router.get('/:noteId',getNote)

export default router;
