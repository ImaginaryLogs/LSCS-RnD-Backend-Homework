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
const isInvalidQuestion = (question) => {
    console.log(question == null, (question === null || question === void 0 ? void 0 : question.length) == 0, question == null || question.length == 0);
    return (question == null || question.length == 0);
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
const isInvalidAnswer = (answer, choices) => {
    let isEmptyString = answer == null || answer.length == 0;
    if (isEmptyString)
        return isEmptyString;
    let matchingAnswers = 0;
    choices === null || choices === void 0 ? void 0 : choices.forEach((choice) => {
        matchingAnswers += choice == answer ? 1 : 0;
    });
    const hasMatchingAnswer = matchingAnswers == 0;
    return hasMatchingAnswer;
};
const invalidMessages = {
    question: 'Invalid Question. Must be a non-empty string.',
    choices: 'Invalid Choices. Must be a non-empty array with at least two non-empty strings.',
    correct_answer: 'Invalid Answer. Answer must be a non-empty string.'
};
export const add_question = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    console.log(payload);
    // could optimize further, but no need for readability.
    if (isInvalidQuestion(payload === null || payload === void 0 ? void 0 : payload.question))
        return res.status(400).json({ message: invalidMessages.question });
    if (isInvalidChoices(payload === null || payload === void 0 ? void 0 : payload.choices))
        return res.status(400).json({ message: invalidMessages.choices });
    if (isInvalidAnswer(payload === null || payload === void 0 ? void 0 : payload.correct_answer, payload === null || payload === void 0 ? void 0 : payload.choices))
        return res.status(400).json({ message: invalidMessages.correct_answer });
    const result = yield r;
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write("Question is valid.");
    res.end();
    return;
}));
export const edit_question = redirect_errors((req, res) => {
});
export const delete_question = redirect_errors((req, res) => {
});
export const get_question = redirect_errors((req, res) => {
});
export const list_questions = redirect_errors((req, res) => {
});
export const check_answer = redirect_errors((req, res) => {
});
//# sourceMappingURL=questionController.mjs.map