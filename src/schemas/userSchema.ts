import mongoose, {Types} from "mongoose";
import user from "../routes/v1/user.js";

const schema : mongoose.Schema = new mongoose.Schema({
    network: {
        type: String,
        required: true
    },
    // Email for communications :3
    email: {
        type: String,
        required: true
    },
    avatarUrl: {
        type: String,
        // FIXME: This is not acceptable lol
        default: "https://static.wikia.nocookie.net/nichijou/images/b/ba/Yukko.jpg/revision/latest/scale-to-width-down/238?cb=20190204184612"
    },
    displayName: {
        type: String,
        default: "A quarky user"
    },
    // Used for linking the user to the LQ User
    _idLQ: {
        type: Types.ObjectId,
        required: true
    }
});

export default schema;

/**
 * Returns a version of a user document that is safe to serve to other users
 * @param userObject
 */
export const safeUser = (userObject) => {
    return {
        _id: userObject._id,
        avatarUrl: userObject.avatarUrl,
        displayName: userObject.displayName
    }
}