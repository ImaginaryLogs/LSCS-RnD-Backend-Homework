import body from 'body-parser';
import dotenv from "dotenv";
import express, { Express, NextFunction, Request, response, Response } from 'express';
import * as mongoDB from "mongodb";
import * as mongoose from 'mongoose';
import * as path from 'path';
import { add_question, check_answer, delete_question, edit_question, get_question, list_questions } from './controller/question.controller.mjs';
import { error_handler, redirect_errors } from './midwares.mjs';
import { MONGO_URL, SERVER_PORT } from './config/config.mjs';


const ROOT_PATH = process.cwd();
const PUBLIC_PATH = path.join(ROOT_PATH, 'public//');
const server: Express = express();


const start_server = async () => {

    mongoose.connect(MONGO_URL)
    .then(result =>{
        console.log("Connected to the Database.")
    })
    .catch(error => {
        console.error(error)
    })

    server.use(express.json())
    server.use(body.urlencoded({extended:true}))

}
start_server();

server.get('/', (req: Request, res: Response)=>{
    res.sendFile('index.html', { root: PUBLIC_PATH});
})

server.post('/create', redirect_errors(add_question));

server.patch('/update', edit_question);

server.delete('/delete', delete_question);

server.post('/get', get_question);

server.get('/list', list_questions);

server.post('/check_answer', check_answer);

server.listen(SERVER_PORT, 'localhost', () => {
    console.log(`Website: http://localhost:${SERVER_PORT}`);
})

server.use(error_handler);

