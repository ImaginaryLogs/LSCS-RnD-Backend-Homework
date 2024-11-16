import express, { Express, NextFunction, Request, response, Response } from 'express';
import * as mongoDB from "mongodb";
import mongoose, * as mongo from 'mongoose';

import { BAD_INPUT_MESSAGES, MONGO_DB_NAME } from '../config/config.mjs';
import { redirect_errors } from "../midwares.mjs";
import { IQuestion, QuestionModel } from "../models/question_model.mjs";

interface IAnswer {
    question: string;
    submitted_answer: string;
};

interface IEditQuestion {
    original_question: string;
    new_parameters: IQuestion;
};

/**
 * Checks if a question is invalid.
 * @param {string | undefined | null} question - The question to validate.
 * @returns {boolean} - Returns true if the question is invalid; otherwise false.
 */
const isInvalidQuestion = (question: String | undefined | null) => {
    return question == null || question.length == 0;
}

/**
 * Checks if a list of choices is invalid.
 * @param {string[] | undefined | null} choices - The choices to validate.
 * @returns {boolean} - Returns true if the choices are invalid; otherwise false.
 */
const isInvalidChoices = (choices: String[] | undefined | null) => {
    const isInvalidArray: Boolean = choices == null || choices.length < 2;

    if (isInvalidArray)
        return isInvalidArray;

    let validLengths: number = 0;
    choices?.forEach((choice) => {
        validLengths += choice.length > 0 ? 1 : 0;
    })

    const hasInvalidAnswer: Boolean = validLengths != choices?.length;

    return hasInvalidAnswer || isInvalidArray;
}

/**
 * Checks if a correct answer is invalid.
 * @param {string | undefined | null} answer - The answer to validate.
 * @param {string[] | undefined | null} choices - The list of choices for the question.
 * @returns {boolean} - Returns true if the correct answer is invalid; otherwise false.
 */

const isInvalidCorrectAnswer = (answer: String | undefined | null, choices: String[] | undefined | null) => {
    if (isInvalidAnswer(answer))
        return true;

    let matchingAnswers: number = 0;
    choices?.forEach((choice) => {
        matchingAnswers += choice == answer? 1 : 0;
    })

    const hasMatchingAnswer: Boolean = matchingAnswers == 0;

    return hasMatchingAnswer;
}

/**
 * Checks if an answer is invalid.
 * @param {string | undefined | null} answer - The answer to validate.
 * @returns {boolean} - Returns true if the answer is invalid; otherwise false.
 */
const isInvalidAnswer = (answer: String | undefined | null) =>{
    return answer == null || answer.length == 0;
}

/**
 * Adds a new question to the database.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} - The response indicating the result of the operation.
 */
export const add_question = redirect_errors(async (req: Request, res: Response) => {   
    let req_payload = req.body;
    
    let error_response = (message_string: string) => res.status(400).json({message: message_string});

    try {
        req_payload = req.body as IQuestion;
    } catch (error: unknown){
        return error_response(BAD_INPUT_MESSAGES.invalid_response);
    }

    console.log(req_payload)
    
    // Check Validness
    if (isInvalidQuestion(req_payload?.question)) return error_response(BAD_INPUT_MESSAGES.invalid_question)

    if (isInvalidChoices(req_payload?.choices)) return error_response(BAD_INPUT_MESSAGES.invalid_choices)
    
    if (isInvalidCorrectAnswer(req_payload?.correct_answer, req_payload?.choices))return error_response(BAD_INPUT_MESSAGES.invalid_correct_answer)
    
    const existingQuestion = await QuestionModel.find().findOne({
        question: req_payload?.question
    })

    if (existingQuestion) return error_response(BAD_INPUT_MESSAGES.question_non_uniqueness)

    const question = await QuestionModel.create({
        question: req_payload?.question,
        choices: req_payload?.choices,
        correct_answer: req_payload?.correct_answer
    })

    return res.status(200).json({message: "Valid response.", db_record: question});
})

/**
 * Edits an existing question in the database.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} - The response indicating the result of the operation.
 */
export const edit_question = redirect_errors(async (req: Request, res: Response) => {
    const req_payload: IEditQuestion = req.body as IEditQuestion;
    const new_params = req_payload?.new_parameters;

    var existingQuestion = await QuestionModel.findOne({question: req_payload.original_question});

    if (!existingQuestion)
        return res.status(400).json({message: BAD_INPUT_MESSAGES.null_question});
    
    if (req_payload.new_parameters == null || Object.keys(req_payload.new_parameters).length == 0)
        return res.status(400).json({message: BAD_INPUT_MESSAGES.null_new_parameters});

    if (new_params?.choices && isInvalidChoices(new_params?.choices))
        return res.status(400).json({message: BAD_INPUT_MESSAGES.invalid_choices});

    if (new_params?.correct_answer && isInvalidCorrectAnswer(new_params?.correct_answer, new_params?.choices ?? existingQuestion.choices))
        return res.status(400).json({message: BAD_INPUT_MESSAGES.invalid_correct_answer});

    const result = QuestionModel.findOneAndUpdate(
        { "question" : req_payload.original_question }, 
        { "$set" : new_params}, 
        { upsert: false }
    ).exec();
    

    return res.status(200).json({message: 'Updated.'});
})

/**
 * Deletes a question from the database.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} - The response indicating the result of the operation.
 */
export const delete_question = redirect_errors(async (req: Request, res: Response) => {
    const { question }: {question: string} = req.body;

    const existingQuestion = await QuestionModel.findOne({question: question});

    if (!existingQuestion)
        return res.status(400).json({message: BAD_INPUT_MESSAGES.null_question});

    const result = await QuestionModel.deleteOne({ question })

    return res.status(200).json(result);

})

/**
 * Retrieves a question from the database.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} - The response containing the question data.
 */
export const get_question = redirect_errors(async (req: Request, res: Response) => {
    const { question }: { question: string } = req.body;

    if (isInvalidQuestion(question))
        return res.status(400).json({message: BAD_INPUT_MESSAGES.invalid_question})
    

    const result = await QuestionModel.findOne({question: question})

    if (!result)
        return res.status(400).json({message: BAD_INPUT_MESSAGES.null_question});

    const question_data = {
        question: result.question,
        choices: result.choices,
        correct_answer: result.correct_answer
    }

    return res.status(200).json(question_data);
})


/**
 * Lists all questions from the database.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} - The response containing the list of questions.
 */
export const list_questions = redirect_errors(async (req: Request, res: Response) => {
    const result = await QuestionModel.find({})
    
    const payload = {
        questions: result,
        count: result.length
    }

    res.status(200).json(payload);
})

/**
 * Checks if a submitted answer is correct.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} - The response indicating whether the answer is correct or not.
 */
export const check_answer = redirect_errors(async (req: Request, res: Response) => {
    const req_payload: IAnswer = req.body as IAnswer;

    if (isInvalidAnswer(req_payload.submitted_answer))
        return res.status(400).json({message: BAD_INPUT_MESSAGES.invalid_submitted_answer});
    
    var existingQuestion = (await QuestionModel.find().findOne({
        question: req_payload?.question
    }))?.toJSON()

    if (!existingQuestion)
        return res.status(400).json({message: BAD_INPUT_MESSAGES.null_question})
    
    if (isInvalidCorrectAnswer(req_payload.submitted_answer, existingQuestion?.choices))
        return res.json({message: BAD_INPUT_MESSAGES.invalid_submitted_answer})
    
    const isUserCorrect: Boolean = existingQuestion.correct_answer == req_payload.submitted_answer;

    return res.status(200).json({message: `Answer is ${isUserCorrect.toString()}`});
})




