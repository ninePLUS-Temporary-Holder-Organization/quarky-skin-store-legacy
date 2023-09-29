import express from 'express';
import RequiredProperties from "../../util/middleware/RequiredProperties.js";
import Reply from "../../classes/Reply/Reply.js";
import Database from "../../db.js";
import NotFoundReply from "../../classes/Reply/NotFoundReply.js";
import BadRequestReply from "../../classes/Reply/BadRequestReply.js";
import {ejson, unleash} from "../../index.js";
import {Types} from "mongoose";
import {emailRegex, safeUser} from "../../schemas/userSchema.js";
import tr46 from "tr46";
import ServerErrorReply from "../../classes/Reply/ServerErrorReply.js";
import Auth from "../../util/middleware/Auth.js";
import FeatureFlag from "../../util/middleware/FeatureFlagMiddleware.js";
import ForbiddenReply from "../../classes/Reply/ForbiddenReply.js";
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