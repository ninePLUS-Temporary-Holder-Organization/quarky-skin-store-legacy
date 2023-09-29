import UnauthorizedReply from "../../classes/Reply/UnauthorizedReply.js";
import Database from "../../db.js";

let database = new Database();

/**
 * Make sure a request is authenticated
 * @param req
 * @param res
 * @param next
 */
export default async function Auth(req, res, next) {
    // TODO: implement
    if (!req.headers.authorization) return res.reply(new UnauthorizedReply("Missing Authorization header with Bearer token"))
    if (!req.headers.authorization.startsWith("Bearer")) return res.reply(new UnauthorizedReply("Authorization header does not contain Bearer token"))
    let splitHeader = req.headers.authorization.split(" ");
    if (!splitHeader[1]) return res.reply(new UnauthorizedReply("Authorization header does not contain Bearer token"))
    next()
}