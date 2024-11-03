import app from './app'
import mongoose from 'mongoose';
import env from './util/validateEnv';

const port = env.PORT;

mongoose.connect(env.MONGOOSE_CONNECTION_STRING)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log('Server is running on port :' + port);
        })
    })
    .catch((err) => {
        console.log("failed to connect to MongoDB: " + err)
    })
