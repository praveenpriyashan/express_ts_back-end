import express, {Request, Response} from 'express'
import "dotenv/config";
import NoteModel from './models/note'
import NoteRoutes from './routes/notes'

const app = express();

app.use(express.json());
app.use('/api/notes', NoteRoutes)   //middleware

export default app;
