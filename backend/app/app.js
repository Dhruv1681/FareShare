import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';

import registerRouter from './routes/index.js';
import verifyToken from './middleware/auth.js'; // Assuming the path to your middleware file

import { SWAGGER_API_PATH } from './constants.js';

const initiliaze = async () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development.local';

    // Load environment variables from the appropriate file
    const result = dotenv.config({
        path: `.env.${process.env.NODE_ENV}`,
    });

    if (result.error) {
        console.error(result.error);
        process.exit(1);
    }

    process.on('uncaughtException', function (err) {
        console.error(err);
        console.log("Node NOT Exiting...");
    });

    try {
        await mongoose.connect(process.env.DB_URI);

        const app = express();

        app.use(cors());
        // Parse Requests of content-type - application/json
        app.use(bodyParser.json()); 
        // Parse Requests of content-type - application/x-www-form-urlencoded
        app.use(bodyParser.urlencoded({ extended: true }));

        // Use the verifyToken middleware for all routes
        app.use(verifyToken);

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        app.use(fileUpload({
            limits: {
                fileSize: 1024 * 1024 * 5 // we are allowing only 5 MB files
            }
        }))

        registerRouter(app);

        const swaggerDocument = YAML.load('./docs/open-api.yaml');
        app.use(SWAGGER_API_PATH, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

        app.listen(process.env.PORT, () => {
            console.log(`Started listening on port ${process.env.PORT}`)
        });
    } catch (error) {
        console.error('Error occured', error.message, error);
    }
}

export default initiliaze;
