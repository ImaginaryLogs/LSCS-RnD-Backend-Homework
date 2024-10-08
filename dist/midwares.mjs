var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * This is a file for any midware functions or any related questions
 */
/**
 * Redirect errors from routes to a default error-handler
 * @param controller the URI that is error prone.
 * @returns none
 */
export const redirect_errors = (controller) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield controller(req, res);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});
/**
 * Centralized function to send error messages.
 * @param error: any errors
 * @param req: request
 * @param res: response
 * @param next: the next func
 * @returns
 */
export function error_handler(error, req, res, next) {
    const time = new Date();
    console.warn(`Server Error at ${time.getHours()}  ${time.getMinutes()}:`);
    console.log(error.name);
    console.error(error);
    switch (error.name) {
        case "MongooseError":
            return res.status(503).json({ message: 'Database down. Please check connection string.' });
    }
    return res.status(404).json({ message: 'Unknown Server Error' });
}
//# sourceMappingURL=midwares.mjs.map