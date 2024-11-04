import express, {Request, Response} from 'express'
import "dotenv/config";
import NoteModel from './models/note'

const app = express();

app.get("/", async (req: Request, res: Response) => {
    const notes = await NoteModel.find().exec();
    res.status(200).json(notes);
})
export default app;