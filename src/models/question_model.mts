import mongoose, { Schema } from 'mongoose';

export interface IQuestion extends Document {
    question: string;
    choices: string[];
    correct_answer: string;
}

const QuestionSchema = new Schema<IQuestion>(
    {
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
    }
)

export const QuestionModel = mongoose.model<IQuestion>('Question', QuestionSchema);
