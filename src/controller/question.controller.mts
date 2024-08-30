import express, { Express, NextFunction, Request, response, Response } from 'express';
import * as mongoDB from "mongodb";
import mongoose, * as mongo from 'mongoose';

import { MONGO_DB_NAME } from '../config/config.mjs';
import { redirect_errors } from "../midwares.mjs";
import { IQuestion, QuestionModel } from "../models/question_model.mjs";


interface IAnswer {
    question: string;
    submitted_answer: string;
};

interface IEditQuestion {
    question: string;
    new_parameters: IQuestion;
};

const isInvalidQuestion = (question: String | undefined | null) => {
    return question == null || question.length == 0;
}

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

const isInvalidAnswer = (answer: String | undefined | null) =>{
    return answer == null || answer.length == 0;
}

const bad_input_messages = {
    invalid_question: 'Invalid question. Must be a non-empty string.',
    invalid_choices: 'Invalid choices. Must be a non-empty array with at least two non-empty strings.',
    invalid_correct_answer: 'Invalid correct answer. Answer must be a non-empty string and among choices.',
    invalid_submitted_answer: 'Invalid answer. Answer must be a non-empty string and must be in the choices.',
    question_non_uniqueness: 'Question alread exists.',
    null_new_parameters: 'No new parameters to update',
    null_question: 'Question does not exist.'
};

export const add_question = (async (req: Request, res: Response) => {   
    const req_payload: IQuestion = req.body as IQuestion;
    console.log(req_payload)
    
    // Check Validness
    if (isInvalidQuestion(req_payload?.question)) 
        return res.status(400).json({message: bad_input_messages.invalid_question})

    if (isInvalidChoices(req_payload?.choices)) 
        return res.status(400).json({message: bad_input_messages.invalid_choices})
    
    if (isInvalidCorrectAnswer(req_payload?.correct_answer, req_payload?.choices))
        return res.status(400).json({message: bad_input_messages.invalid_correct_answer})
    
    const existingQuestion = await QuestionModel.find().findOne({
        question: req_payload?.question
    })

    if (existingQuestion)
        return res.status(400).json({message: bad_input_messages.question_non_uniqueness})

    const question = await QuestionModel.create({
        question: req_payload?.question,
        choices: req_payload?.choices,
        correct_answer: req_payload?.correct_answer
    })

    return res.status(200).json(question);
})


export const edit_question = redirect_errors(async (req: Request, res: Response) => {
    const req_payload: IEditQuestion = req.body as IEditQuestion;
    const new_params = req_payload?.new_parameters;

    var existingQuestion = await QuestionModel.findOne({question: req_payload.question});

    if (!existingQuestion)
        return res.status(400).json({message: bad_input_messages.null_question});
    
    if (req_payload.new_parameters == null)
        return res.status(400).json({message: bad_input_messages.null_new_parameters});

    if (new_params?.choices && isInvalidChoices(new_params?.choices))
        return res.status(400).json({message: bad_input_messages.invalid_choices});

    if (new_params?.correct_answer && isInvalidCorrectAnswer(new_params?.correct_answer, new_params?.choices ?? existingQuestion.choices))
        return res.status(400).json({message: bad_input_messages.invalid_correct_answer});

    const result = QuestionModel.findOneAndUpdate(
        { "question" : req_payload.question }, 
        { "$set" : new_params}, 
        { upsert: false }
    ).exec();
    

    return res.status(200).json({message: 'Updated.'});
})

export const delete_question = redirect_errors(async (req: Request, res: Response) => {
    const { question }: {question: string} = req.body;

    const existingQuestion = await QuestionModel.findOne({question: question});

    if (!existingQuestion)
        return res.status(400).json({message: bad_input_messages.null_question});

    const result = await QuestionModel.deleteOne({ question })

    return res.status(200).json(result);

})

export const get_question = redirect_errors(async (req: Request, res: Response) => {
    const { question }: { question: string } = req.body;

    if (isInvalidQuestion(question))
        return res.status(400).json({message: bad_input_messages.invalid_question})
    

    const result = await QuestionModel.findOne({question: question})

    if (!result)
        return res.status(400).json({message: bad_input_messages.null_question});

    const question_data = {
        question: result.question,
        choices: result.choices,
        correct_answer: result.correct_answer
    }

    return res.status(200).json(question_data);
})

export const list_questions = redirect_errors(async (req: Request, res: Response) => {
    const result = await QuestionModel.find({})
    
    const payload = {
        questions: result,
        count: result.length
    }

    res.status(200).json(payload);
})

export const check_answer = redirect_errors(async (req: Request, res: Response) => {
    const req_payload: IAnswer = req.body as IAnswer;

    if (isInvalidAnswer(req_payload.submitted_answer))
        return res.status(400).json({message: bad_input_messages.invalid_submitted_answer});
    
    var existingQuestion = (await QuestionModel.find().findOne({
        question: req_payload?.question
    }))?.toJSON()

    if (!existingQuestion)
        return res.status(400).json({message: bad_input_messages.null_question})
    
    if (isInvalidCorrectAnswer(req_payload.submitted_answer, existingQuestion?.choices))
        return res.json({message: bad_input_messages.invalid_submitted_answer})
    
    const isUserCorrect: Boolean = existingQuestion.correct_answer == req_payload.submitted_answer;

    console.log(isUserCorrect);
    return res.status(200).json({message: `Answer is ${isUserCorrect.toString()}`});
})




