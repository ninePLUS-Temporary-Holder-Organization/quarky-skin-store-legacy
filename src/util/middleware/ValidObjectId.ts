import {isValidObjectId} from "mongoose";
import BadRequestReply from "../../classes/Reply/BadRequestReply.js";

/**
 * Middleware to check if a uri parameter is a valid Object ID
 * @param paramName
 * @returns {Function}
 */
export default function (paramName : string) {
    return function (req, res, next : Function) {
        if (isValidObjectId(req.params?.[paramName])) return next();
        res.reply(new BadRequestReply(`${paramName} should be an Object ID`))
    }
}