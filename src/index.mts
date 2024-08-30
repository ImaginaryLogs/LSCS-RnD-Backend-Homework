import body from 'body-parser';
import dotenv from "dotenv";
import express, { Express, NextFunction, Request, Response } from 'express';
import * as mongoose from 'mongoose';
import * as path from 'path';
import { DOMAIN_NAME, MONGO_URL, SERVER_PORT } from './config/config.mjs';
import { add_question, check_answer, delete_question, edit_question, get_question, list_questions } from './controller/question.controller.mjs';
import { error_handler, redirect_errors } from './midwares.mjs';

const ROOT_PATH = process.cwd();
const PUBLIC_PATH = path.join(ROOT_PATH, 'public//');
const server: Express = express();
var is_db_connected = false;

/**
 * Opens a connection to the database and the server
 */
const start_server = async () => {
    mongoose.connect(MONGO_URL)
    .then(result =>{
        console.log("\nConnected to the Database.")
    })
    .catch(error => {
        console.warn("\nPlease connect to a local MongoDB Database.\n Paste in src/config/config.mts as required.\n");
    })

    server.use(express.json())
    server.use(body.urlencoded({extended:true}))
}

/**
 * Checks relevant information about the serever
 */
const server_status_check = () => {
    const statuses = [
        `Welcome to my ImaginaryLog's Question Database!\n`,
        `Website: http://${DOMAIN_NAME}:${SERVER_PORT}`,
        `Database Connection: ` + is_db_connected.toString(),
    ]

    statuses.forEach( stat => console.log(stat))
}

start_server();

server.get('/', (req: Request, res: Response)=>
    res.sendFile('index.html', { root: PUBLIC_PATH})
)

server.use('/public', express.static(PUBLIC_PATH));

server.post('/create', add_question);

server.patch('/update', edit_question);

server.delete('/delete', delete_question);

server.post('/get', get_question);

server.get('/list', list_questions);

server.post('/check_answer', check_answer);

server.listen(SERVER_PORT, DOMAIN_NAME, server_status_check);

server.use(error_handler);

