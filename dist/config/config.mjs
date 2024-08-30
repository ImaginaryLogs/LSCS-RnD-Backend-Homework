import dotenv from "dotenv";
import * as process from 'process';
dotenv.config();
export const MONGO_URL = process.env.MONGO_URL || '';
export const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'LSCSDB';
export const MONGO_QUESTION_COLLECTION_NAME = process.env.MONGO_QUESTION_COLLECTION_NAME || 'questions';
export const SERVER_PORT = Number(process.env.PORT) || 8080;
export const DOMAIN_NAME = process.env.DOMAIN_NAME || `localhost`;
export const BAD_INPUT_MESSAGES = {
    invalid_response: 'Improper format',
    invalid_question: 'Invalid question. Must be a non-empty string.',
    invalid_choices: 'Invalid choices. Must be a non-empty array with at least two non-empty strings.',
    invalid_correct_answer: 'Invalid correct answer. Answer must be a non-empty string and among choices.',
    invalid_submitted_answer: 'Invalid answer. Answer must be a non-empty string and must be in the choices.',
    question_non_uniqueness: 'Question already exists.',
    null_new_parameters: 'No new parameters to update',
    null_question: 'Question does not exist.'
};
//# sourceMappingURL=config.mjs.map