var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { redirect_errors } from "../midwares.mjs";
import { QuestionModel } from "../models/question_model.mjs";
;
;
const isInvalidQuestion = (question) => {
    return question == null || question.length == 0;
};
const isInvalidChoices = (choices) => {
    const isInvalidArray = choices == null || choices.length < 2;
    if (isInvalidArray)
        return isInvalidArray;
    let validLengths = 0;
    choices === null || choices === void 0 ? void 0 : choices.forEach((choice) => {
        validLengths += choice.length > 0 ? 1 : 0;
    });
    const hasInvalidAnswer = validLengths != (choices === null || choices === void 0 ? void 0 : choices.length);
    return hasInvalidAnswer || isInvalidArray;
};
const isInvalidCorrectAnswer = (answer, choices) => {
    if (isInvalidAnswer(answer))
        return true;
    let matchingAnswers = 0;
    choices === null || choices === void 0 ? void 0 : choices.forEach((choice) => {
        matchingAnswers += choice == answer ? 1 : 0;
    });
    const hasMatchingAnswer = matchingAnswers == 0;
    return hasMatchingAnswer;
};
const isInvalidAnswer = (answer) => {
    return answer == null || answer.length == 0;
};
const bad_input_messages = {
    invalid_question: 'Invalid question. Must be a non-empty string.',
    invalid_choices: 'Invalid choices. Must be a non-empty array with at least two non-empty strings.',
    invalid_correct_answer: 'Invalid correct answer. Answer must be a non-empty string and among choices.',
    invalid_submitted_answer: 'Invalid answer. Answer must be a non-empty string and must be in the choices.',
    question_non_uniqueness: 'Question alread exists.',
    null_new_parameters: 'No new parameters to update',
    null_question: 'Question does not exist.'
};
export const add_question = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const req_payload = req.body;
    console.log(req_payload);
    // Check Validness
    if (isInvalidQuestion(req_payload === null || req_payload === void 0 ? void 0 : req_payload.question))
        return res.status(400).json({ message: bad_input_messages.invalid_question });
    if (isInvalidChoices(req_payload === null || req_payload === void 0 ? void 0 : req_payload.choices))
        return res.status(400).json({ message: bad_input_messages.invalid_choices });
    if (isInvalidCorrectAnswer(req_payload === null || req_payload === void 0 ? void 0 : req_payload.correct_answer, req_payload === null || req_payload === void 0 ? void 0 : req_payload.choices))
        return res.status(400).json({ message: bad_input_messages.invalid_correct_answer });
    const existingQuestion = yield QuestionModel.find().findOne({
        question: req_payload === null || req_payload === void 0 ? void 0 : req_payload.question
    });
    if (existingQuestion)
        return res.status(400).json({ message: bad_input_messages.question_non_uniqueness });
    const question = yield QuestionModel.create({
        question: req_payload === null || req_payload === void 0 ? void 0 : req_payload.question,
        choices: req_payload === null || req_payload === void 0 ? void 0 : req_payload.choices,
        correct_answer: req_payload === null || req_payload === void 0 ? void 0 : req_payload.correct_answer
    });
    return res.status(200).json(question);
}));
export const edit_question = redirect_errors((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const req_payload = req.body;
    const new_params = req_payload === null || req_payload === void 0 ? void 0 : req_payload.new_parameters;
    var existingQuestion = yield QuestionModel.findOne({ question: req_payload.question });
    if (!existingQuestion)
        return res.status(400).json({ message: bad_input_messages.null_question });
    if (req_payload.new_parameters == null)
        return res.status(400).json({ message: bad_input_messages.null_new_parameters });
    if ((new_params === null || new_params === void 0 ? void 0 : new_params.choices) && isInvalidChoices(new_params === null || new_params === void 0 ? void 0 : new_params.choices))
        return res.status(400).json({ message: bad_input_messages.invalid_choices });
    if ((new_params === null || new_params === void 0 ? void 0 : new_params.correct_answer) && isInvalidCorrectAnswer(new_params === null || new_params === void 0 ? void 0 : new_params.correct_answer, (_a = new_params === null || new_params === void 0 ? void 0 : new_params.choices) !== null && _a !== void 0 ? _a : existingQuestion.choices))
        return res.status(400).json({ message: bad_input_messages.invalid_correct_answer });
    const result = QuestionModel.findOneAndUpdate({ "question": req_payload.question }, { "$set": new_params }, { upsert: false }).exec();
    return res.status(200).json({ message: 'Updated.' });
}));
export const delete_question = redirect_errors((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { question } = req.body;
    const existingQuestion = yield QuestionModel.findOne({ question: question });
    if (!existingQuestion)
        return res.status(400).json({ message: bad_input_messages.null_question });
    const result = yield QuestionModel.deleteOne({ question });
    return res.status(200).json(result);
}));
export const get_question = redirect_errors((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { question } = req.body;
    if (isInvalidQuestion(question))
        return res.status(400).json({ message: bad_input_messages.invalid_question });
    const result = yield QuestionModel.findOne({ question: question });
    if (!result)
        return res.status(400).json({ message: bad_input_messages.null_question });
    const question_data = {
        question: result.question,
        choices: result.choices,
        correct_answer: result.correct_answer
    };
    return res.status(200).json(question_data);
}));
export const list_questions = redirect_errors((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield QuestionModel.find({});
    const payload = {
        questions: result,
        count: result.length
    };
    res.status(200).json(payload);
}));
export const check_answer = redirect_errors((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const req_payload = req.body;
    if (isInvalidAnswer(req_payload.submitted_answer))
        return res.status(400).json({ message: bad_input_messages.invalid_submitted_answer });
    var existingQuestion = (_a = (yield QuestionModel.find().findOne({
        question: req_payload === null || req_payload === void 0 ? void 0 : req_payload.question
    }))) === null || _a === void 0 ? void 0 : _a.toJSON();
    if (!existingQuestion)
        return res.status(400).json({ message: bad_input_messages.null_question });
    if (isInvalidCorrectAnswer(req_payload.submitted_answer, existingQuestion === null || existingQuestion === void 0 ? void 0 : existingQuestion.choices))
        return res.json({ message: bad_input_messages.invalid_submitted_answer });
    const isUserCorrect = existingQuestion.correct_answer == req_payload.submitted_answer;
    console.log(isUserCorrect);
    return res.status(200).json({ message: `Answer is ${isUserCorrect.toString()}` });
}));
//# sourceMappingURL=question.controller.mjs.map