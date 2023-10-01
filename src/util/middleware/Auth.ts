import UnauthorizedReply from "../../classes/Reply/UnauthorizedReply.js";
import Database from "../../db.js";
import axios from "axios";
import ipaddr from "ipaddr.js";
import {lookup} from "dns/promises";
import url from "node:url";

let database = new Database();

/**
 * Make sure a request is authenticated
 * Updates cached user data from user's LQ network
 * @param req
 * @param res
 * @param next
 */
export default async function Auth(req, res, next) {
    if (!req.headers.authorization) return res.reply(new UnauthorizedReply("Missing Authorization header with Bearer token"))
    if (!req.headers.authorization.startsWith("Bearer")) return res.reply(new UnauthorizedReply("Authorization header does not contain Bearer token"))
    let splitHeader = req.headers.authorization.split(" ");
    if (!splitHeader[1]) return res.reply(new UnauthorizedReply("Authorization header does not contain Bearer token"))
    let tokenParts = splitHeader[1].split(".");
    if (tokenParts.length !== 3) return res.reply(new UnauthorizedReply("Invalid token"))

    try {
        let payload = JSON.parse(Buffer.from(tokenParts[1], "base64").toString());

        // Don't make a request if the network looks suspicious
        if (!payload.iss.startsWith("https://")) return res.reply(new UnauthorizedReply("Token must be from https-enabled network"))
        let networkIP = await lookup((url.parse(payload.iss).hostname) || "");
        let blockedRanges = [
            "carrierGradeNat",
            "reserved",
            "private",
            "loopback",
            "broadcast",
            "uniqueLocal",
            "linkLocal"
        ]
        if (blockedRanges.includes(ipaddr.parse(networkIP.address).range())) return res.reply(new UnauthorizedReply("Token must come from internet-accessible network"))

        let userInformation = await axios.get(`${payload.iss}/v2/user/me`, {
            headers: {
                Accept: "application/json",
                Authorization: req.headers.authorization
            }
        })

        // We can trust* the token payload, this token was verified by the network that issued it
        // *to a degree
        // TODO: consider not calling this every time Auth middleware is called
        let userData = await findOrCreateFromLQ(userInformation.data.response.jwtData);

        req.user = userData;
        res.locals.user = userData;

        next()
    } catch (e) {
        return res.reply(new UnauthorizedReply("Invalid token"))
    }
}

async function findOrCreateFromLQ(userObject) {
    let updateData = {
        network: userObject.iss,
        email: userObject.email,
        avatarUrl: userObject.avatar,
        displayName: userObject.username,
        _idLQ: userObject._id
    }
    return await database.User.findOneAndUpdate({_idLQ: userObject._id, network: userObject.iss}, updateData, {upsert: true, new: true})
}