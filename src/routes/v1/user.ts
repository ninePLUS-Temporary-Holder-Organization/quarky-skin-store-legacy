import express from 'express';
import Reply from "../../classes/Reply/Reply.js";
import Database from "../../db.js";
import Auth from "../../util/middleware/Auth.js";
const router = express.Router();

const database = new Database();

router.get("/me", Auth, async (req, res) => {
    res.reply(new Reply({
        response: {
            message: "Successfully authenticated",
            user: req.user
        }
    }))
})

export default router;