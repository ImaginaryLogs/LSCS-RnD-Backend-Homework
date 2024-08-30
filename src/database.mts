import body from 'body-parser';
import dotenv from "dotenv";
import express, { Express, NextFunction, Request, response, Response } from 'express';
import * as mongoDB from "mongodb";
import * as mongoose from 'mongoose';
import * as path from 'path';
import * as proc from 'process';
import { add_question, check_answer, delete_question, edit_question, get_question, list_questions } from './controller/question.controller.mjs';
import { error_handler, redirect_errors } from './midwares.mjs';

export const collections: { questions?: mongoDB.Collection } = {}
