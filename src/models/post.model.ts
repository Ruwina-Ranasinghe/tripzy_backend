import mongoose, { Document, Schema, model } from "mongoose";
import {IUser} from "./user.model.js";

export interface IPost extends Document {
    caption: string;
    imageUrl?: string;
    location?: string;
    locationCoords?: {
        lat: Number,
        lng: Number
    }
    taggedPeople?: mongoose.Types.ObjectId[];
    postedBy: mongoose.Types.ObjectId | IUser;
    likes: mongoose.Types.ObjectId[];
    comments: {
        user: mongoose.Types.ObjectId;
        text: string;
        createdAt: Date;
    }[];
    impressions: number;
    aiCaption?: string;
    aiTags?: string[];
    imageEmbedding?: number[];
    createdAt: Date;

}

const postSchema = new Schema<IPost>(
    {
        caption: { type: String, required: false },
        imageUrl: { type: String, required: false },

        location: { type: String },

        locationCoords: {
            lat: Number,
            lng: Number
        },
        taggedPeople: [
            { type: Schema.Types.ObjectId, ref: "User" }
        ],

        postedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: false
        },

        likes: [
            { type: Schema.Types.ObjectId, ref: "User" }
        ],

        comments: [
            {
                user: { type: Schema.Types.ObjectId, ref: "User" },
                text: { type: String },
                createdAt: { type: Date, default: Date.now }
            }
        ],

        impressions: { type: Number, default: 0 },
        aiCaption: { type: String },
        aiTags: { type: [String], default: [] },
        imageEmbedding: [{ type: Number }]
    },
    { timestamps: true }
);

export const Post = model<IPost>("Post", postSchema);
