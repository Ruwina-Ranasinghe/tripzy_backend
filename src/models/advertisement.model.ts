import mongoose, { Document, Schema, model } from "mongoose";
import { IUser } from "./user.model.js";

export interface IAdvertisement extends Document {
    category: 'hotel' | 'vehicle' | 'restaurant' | 'tour';
    title: string;
    description: string;
    images: string[];
    location: string;
    locationCoords?: {
        lat: Number,
        lng: Number
    };
    details: {
        // Hotel
        pricePerNight?: number;
        roomType?: string;
        amenities?: string[];
        foodPlans?: string[];

        // Vehicle
        pricePerDay?: number;
        vehicleType?: string;
        seatingCapacity?: number;
        transmission?: string;

        // Restaurant
        cuisine?: string;
        priceRange?: string;
        openingHours?: string;

        // Tour
        duration?: string;
        price?: number;
        groupSize?: number;
        includes?: string[];
    };
    contactPhone: string;
    contactEmail: string;
    postedBy: mongoose.Types.ObjectId | IUser;
    inquiries: {
        user: mongoose.Types.ObjectId;
        message: string;
        createdAt: Date;
    }[];
    status: 'active' | 'inactive' | 'pending';
    views: number;
    impressions: number;
    createdAt: Date;
    updatedAt: Date;
}

const advertisementSchema = new Schema<IAdvertisement>(
    {
        category: {
            type: String,
            required: true,
            enum: ['hotel', 'vehicle', 'restaurant', 'tour']
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000
        },
        images: [{
            type: String,
            required: true
        }],
        location: {
            type: String,
            required: true,
            trim: true
        },
        locationCoords: {
            lat: Number,
            lng: Number
        },
        details: {
            // Hotel fields
            pricePerNight: { type: Number, min: 0 },
            roomType: { type: String, trim: true },
            amenities: [{ type: String }],
            foodPlans: [{ type: String }],

            // Vehicle fields
            pricePerDay: { type: Number, min: 0 },
            vehicleType: { type: String, trim: true },
            seatingCapacity: { type: Number, min: 1 },
            transmission: { type: String, trim: true },

            // Restaurant fields
            cuisine: { type: String, trim: true },
            priceRange: { type: String, trim: true },
            openingHours: { type: String, trim: true },

            // Tour fields
            duration: { type: String, trim: true },
            price: { type: Number, min: 0 },
            groupSize: { type: Number, min: 1 },
            includes: [{ type: String }]
        },
        contactPhone: {
            type: String,
            required: true,
            trim: true
        },
        contactEmail: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        postedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        inquiries: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },
                message: {
                    type: String,
                    required: true,
                    trim: true,
                    maxlength: 1000
                },
                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        status: {
            type: String,
            enum: ['active', 'inactive', 'pending'],
            default: 'active'
        },
        views: {
            type: Number,
            default: 0
        },
        impressions: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Indexes for better query performance
advertisementSchema.index({ category: 1, status: 1 });
advertisementSchema.index({ postedBy: 1 });
advertisementSchema.index({ createdAt: -1 });
advertisementSchema.index({ location: 'text', title: 'text', description: 'text' });

// Virtual for inquiry count
advertisementSchema.virtual('inquiryCount').get(function() {
    return this.inquiries.length;
});

export const Advertisement = model<IAdvertisement>("Advertisement", advertisementSchema);