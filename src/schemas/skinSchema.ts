import mongoose from "mongoose";
import url from 'node:url';
import ObjectIdToDate from "../util/ObjectIdToDate.js";

const schema : mongoose.Schema = new mongoose.Schema({
    // Skin name
    name: {
        type: String,
        required: true,
        unique: true
    },
    // creator is an object id in the database, but populated with the relevant document from the users collection when queried
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    // ID of the related nyaFile
    fileId: {
        type: String,
        required: true,
        unique: true
    }
    // add more fields here like description, tags etc. if you want
}, {
    // Make sure virtual fields are included in JSON conversions of documents
    // So responses and stuff
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add virtual field for createdAt, this is the date when the document was created in MongoDB
schema.virtual("createdAt").get(function () {
    // @ts-ignore (it doesn't know)
    return ObjectIdToDate(this._id);
})

// Every time documents are queried populate createdAt and owner fields
schema.pre("find", function (next) {
    this.populate("createdAt");
    this.populate("creator");
    next();
})

export default schema;