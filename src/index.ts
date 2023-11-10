import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import fs from "fs";
import NotFoundReply from "./classes/Reply/NotFoundReply.js";
import Database from "./db.js";
import FeatureFlag from "./util/middleware/FeatureFlagMiddleware.js";
import Reply from "./classes/Reply/Reply.js";
import { initialize } from 'unleash-client';
import axios from "axios";

const pjson = JSON.parse(fs.readFileSync("package.json").toString());
const ejson = JSON.parse(fs.readFileSync("environment.json").toString());
if (ejson.env === "prod") process.env.NODE_ENV = "production";

export { pjson, ejson }

const database = new Database();
const app = express();

export const unleash = initialize({
    url: 'https://feature-gacha.litdevs.org/api',
    appName: 'quarky-skin-store',
    environment: ejson.environment === "dev" ? "development" : "production",
    // @ts-ignore
    customHeaders: { Authorization: process.env.UNLEASH_TOKEN },
});

// Set up body parsers
app.use(express.json());
app.use(express.text({limit: "50mb"}));

// Set up custom middleware
app.use((req, res, next) => {
    // Allow CORS usage
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization,*")
    res.header("Access-Control-Allow-Methods", "*")

    // Define reply method, to set status code accordingly
    res.reply = (reply : Reply) => {
        res.status(reply.request.status_code).json(reply);
    }

    res.locals.unleashContext = {
        remoteAddress: req.headers["x-forwarded-for"] || req.ip,
    };

    // Continue
    next();
})

app.use(FeatureFlag("QS_API_killswitch"))

// Set up locals
app.locals.pjson = pjson;
app.locals.ejson = ejson;

// Set up routes
import v1_home from "./routes/v1/home.js";
import v1_skin from "./routes/v1/skin.js";
import v1_user from "./routes/v1/user.js";
app.use("/", express.static("public"))
app.use("/api/v1", v1_home);
app.use("/api/v1/skin", v1_skin);
app.use("/api/v1/user", v1_user);

app.post("/diagtun", async (req, res) => {
    try {
        const envelope = req.body;

        const pieces = envelope.split('\n');

        const header = JSON.parse(pieces[0]);

        const { host, pathname, username } = new URL(header.dsn);

        const projectId = pathname.slice(1);

        const url = `https://${host}/api/${projectId}/envelope/?sentry_key=${username}`;

        const options = {
            'headers': {
                'Content-Type': 'application/x-sentry-envelope'
            }
        };

        const response = await axios.post(url, envelope, options);

        res.status(201).json({ message: "Success", data: response?.data })
    } catch (e : any) {
        const error = e?.response || e?.message;
        res.status(400).json({ message: 'invalid request', error: error });
    }
})

/*
import Email from "./classes/Email/Email.js";
app.post("/testemail", async (req, res) => {
    // constructor(subject, recipientAddress, recipientDisplayName, bodyPlain, bodyHTML) {
    const email = new Email(req.body.subject, req.body.recipientAddress, req.body.recipientDisplayName, req.body.bodyPlain, req.body.bodyHTML)
    res.reply(new Reply({
        response: {
            message: "Sent",
            info: await email.send()
        }
    }))
})*/

// Catch all other requests with 404
app.all("*", async (req, res) => {
    res.reply(new NotFoundReply());
})

// Make sure both databases and feature gacha are ready before starting listening for requests
let unleashReady = false;
let databaseReady = false;

database.events.once("ready", () => {
    databaseReady = true;
    startServer();
});

unleash.on('synchronized', () => {
    console.debug("Feature gacha rolled")
    unleashReady = true;
    startServer();
});

const startServer = () => {
    if (!databaseReady || !unleashReady) return;
    app.listen(process.env.PORT || 9999, async () => {
        console.log(`${await database.Skin.countDocuments({})} skin documents in Runestone`)
        console.log(`Listening on port ${process.env.PORT || 9999}`);
    });
}
