import {Types} from "mongoose";

/**
 * Turn MongoDB ObjectID into a Date
 * @param objectId
 * @returns {Date}
 */
export default function (objectId : Types.ObjectId) {
    return new Date(parseInt(String(objectId).substring(0, 8), 16) * 1000);
};