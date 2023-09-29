import express from 'express';
import Reply from "../../classes/Reply/Reply.js";
import Database from "../../db.js";
import {safeUser} from "../../schemas/userSchema.js";
import Auth from "../../util/middleware/Auth.js";
const router = express.Router();

const database = new Database();

router.get("/me", Auth, async (req, res) => {
    res.reply(new Reply({
        response: {
            message: "Successfully authenticated",
            user: safeUser(req.user, true)
        }
    }))
})

export default router;