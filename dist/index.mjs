var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import body from 'body-parser';
import express from 'express';
import * as mongoose from 'mongoose';
import * as path from 'path';
import { DOMAIN_NAME, MONGO_URL, SERVER_PORT } from './config/config.mjs';
import { add_question, check_answer, delete_question, edit_question, get_question, list_questions } from './controller/question.controller.mjs';
import { error_handler } from './midwares.mjs';
const ROOT_PATH = process.cwd();
const PUBLIC_PATH = path.join(ROOT_PATH, 'public//');
const server = express();
var is_db_connected = false;
/**
 * Opens a connection to the database and the server
 */
const start_server = () => __awaiter(void 0, void 0, void 0, function* () {
    mongoose.connect(MONGO_URL)
        .then(result => {
        console.log("\nConnected to the Database.");
    })
        .catch(error => {
        console.warn("\nPlease connect to a local MongoDB Database.\n Paste in src/config/config.mts as required.\n");
    });
    server.use(express.json());
    server.use(body.urlencoded({ extended: true }));
});
/**
 * Checks relevant information about the serever
 */
const server_status_check = () => {
    const statuses = [
        `Welcome to my ImaginaryLog's Question Database!\n`,
        `Website: http://${DOMAIN_NAME}:${SERVER_PORT}`,
        `Database Connection: ` + is_db_connected.toString(),
    ];
    statuses.forEach(stat => console.log(stat));
};
start_server();
server.get('/', (req, res) => res.sendFile('index.html', { root: PUBLIC_PATH }));
server.use('/public', express.static(PUBLIC_PATH));
server.post('/create', add_question);
server.patch('/update', edit_question);
server.delete('/delete', delete_question);
server.post('/get', get_question);
server.get('/list', list_questions);
server.post('/check_answer', check_answer);
server.listen(SERVER_PORT, DOMAIN_NAME, server_status_check);
server.use(error_handler);
//# sourceMappingURL=index.mjs.map