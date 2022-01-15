import express from "express";
import {createConnection} from "typeorm";
import cookieParser from "cookie-parser";
import cors from "cors";
import {routes} from "./routes";
import dotenv from 'dotenv';

dotenv.config();

createConnection().then(async () => {
    const app = express();

    app.use(cookieParser());
    app.use(express.json());
    app.use(cors({
        credentials: true,
        origin: ['http://localhost:8003']
    }));

    routes(app);

    app.listen(8000, () => {
        console.log('listening to port 8000')
    });
});
