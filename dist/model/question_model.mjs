import * as mongoose from 'mongoose';
const QuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Enter a question to answer."],
        unique: true
    },
    choices: {
        type: [String],
        required: [true, "Enter at least two choices."],
        unique: false
    },
    correct_answer: {
        type: String,
        required: true,
        unique: false
    }
}, {
    timestamps: true
});
export const QuestionModel = mongoose.model("Question", QuestionSchema);
//# sourceMappingURL=question_model.mjs.map