import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import EventEmitter from "events";
import skinSchema from "./schemas/skinSchema.js";
import userSchema from "./schemas/userSchema.js";

export default class Database {

    private static _instance: Database;
    connected: boolean = false;

    db: any;
    events: EventEmitter = new EventEmitter();

    Skin;
    User;

    constructor() {
        if (typeof Database._instance === "object") return Database._instance;
        Database._instance = this;

        // Connect to the database
        const DB_URI : string | undefined = process.env.MONGODB_URI
        if (typeof DB_URI === "undefined") {
            console.error("\nMONGODB_URI not found, Exiting...");
            process.exit(2);
        }

        this.db = mongoose.createConnection(DB_URI);

        this.db.once("open", () => {
            this.#onOpen();
            this.connected = true;
        })
    }

    #onOpen() {
        console.log("Runestone connection established");
        this.Skin = this.db.model('skin', skinSchema);
        this.User = this.db.model('user', userSchema);
        this.events.emit("ready");
    }
}