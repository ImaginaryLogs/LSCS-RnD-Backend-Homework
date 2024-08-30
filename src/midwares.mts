import express, { Request, Response, NextFunction } from "express"

/**
 * This is a file for any midware functions or any related questions
 */

/**
 * Redirect errors from routes to a default error-handler
 * @param controller the URI that is error prone.
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
 * @param error: any errors
 * @param req: request
 * @param res: response
 * @param next: the next func
 * @returns 
 */
export function error_handler (error: Error, req: Request, res: Response, next: NextFunction) {
    const time = new Date();
    console.warn(`Server Error at ${time.getHours()}  ${time.getMinutes()}:`);
    console.log(error.name);
    console.error(error);


    switch(error.name){
        case "MongooseError":
            return res.status(503).json({message: 'Database down. Please check connection string.'});
    }

    return res.status(404).json({message: 'Unknown Server Error'});
}

