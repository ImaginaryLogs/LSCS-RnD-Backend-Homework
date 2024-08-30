import dotenv from "dotenv";
import * as process from 'process';
dotenv.config();
export const MONGO_URL = process.env.MONGO_URL || '';
export const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'LSCSDB';
export const MONGO_QUESTION_COLLECTION_NAME = process.env.MONGO_QUESTION_COLLECTION_NAME || 'questions';
export const SERVER_PORT = Number(process.env.PORT) || 8080;
//# sourceMappingURL=config.mjs.map