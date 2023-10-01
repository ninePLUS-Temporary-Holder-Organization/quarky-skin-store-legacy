import express from 'express';
import Reply from "../../classes/Reply/Reply.js";
import Database from "../../db.js";
import NotFoundReply from "../../classes/Reply/NotFoundReply.js";
import ValidObjectId from "../../util/middleware/ValidObjectId.js";

const router = express.Router();

const database = new Database();

router.get("/:skinId", ValidObjectId("skinId"), async (req, res) => {
    let skin = await database.Skin.findOne({_id: req.params.skinId})
    if (!skin) return res.reply(new NotFoundReply("Skin not found", true)) // TODO: Evaluate if success = true is insane
    res.reply(new Reply({
        response: {
            message: "Skin information retrieved",
            skin
        }
    }))
})

export default router;