import express, { Request, Response, NextFunction } from "express"
import dotenv from "dotenv"
import * as mongoDB from "mongodb";
import * as mongo from 'mongoose';
import * as proc from 'process';

/**
 * This is a file for any midware functions or any related questions
 */

/**
 * Redirect errors from routes to a default error-handler
 * @param controller The URI that is error prone.
 * @returns none
 */
export const redirect_errors = (controller: Function) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await controller (req, res);
    } catch (err: unknown) {
        console.error(err)
        next(err)
    }
}

/**
 * Centralized function to send error messages.
 * @param error 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export function error_handler (error: Error, req: Request, res: Response, next: NextFunction) {

    console.warn(`Server Error at ${new Date().getTime()}:`);
    console.error(error);

    return res.status(404).json({message: 'Unknown Server Error'});
}

