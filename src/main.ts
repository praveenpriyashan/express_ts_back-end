import "dotenv/config";
import express from 'express'
import mongoose from 'mongoose';
import env from './util/validateEnv';

const app = express();
const port = env.PORT;

app.get("/", (req, res) => {
    res.send("Hello World");
})
mongoose.connect(env.MONGOOSE_CONNECTION_STRING)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log('Server is running on port :' + port);
        })
    })
    .catch((err) => {
        console.log("failed to connect to MongoDB: "+ err)
    })
