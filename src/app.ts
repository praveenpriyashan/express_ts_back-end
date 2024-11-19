import express, {NextFunction, Request, Response} from 'express'
import "dotenv/config";
import NoteRoutes from './routes/notes'
import UserRoutes from './routes/user'
import createHttpError, {isHttpError} from "http-errors";
import session from "express-session";
import env from "./util/validateEnv"
import mongoStore from "connect-mongo"

const app = express();

app.use(express.json());
app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: mongoStore.create({
        mongoUrl: env.MONGOOSE_CONNECTION_STRING
    })
}))
app.use('/api/users', UserRoutes)   //middleware
app.use('/api/notes', NoteRoutes)   //middleware

app.use((req: Request, res: Response, next: NextFunction) => {
    next(createHttpError(404, "endpoint not found"));
})

const errr = (error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.log(error)
    let errorMessage = "an unknown error message"
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message
    }
    res.status(statusCode).json({error: errorMessage})
}
app.use(errr);

export default app;
