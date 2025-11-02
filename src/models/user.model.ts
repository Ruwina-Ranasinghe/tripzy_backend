import mongoose, {Document, Schema, model} from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document{
    firstName: string;
    lastName: string;
    displayName: string;
    email: string;
    password: string;
    picturePath?: string;
    travelBuddies:mongoose.Types.ObjectId[];
    country: string;
    scoreForLeaderboard: number;
    viewedProfile: number;
    impressions: number;
    preferences?: {
        // Travel Style / Interest
        travelStyle?: string[];       // e.g., ["Adventure", "Cultural"]
        travelCompanion?: string;     // e.g., "Solo", "With friends", "Family"

        // Activity Preferences
        activities?: string[];        // e.g., ["Hiking", "Photography", "Local Food"]

        // Destination Preferences
        preferredDestinations?: string[]; // e.g., ["Mountains", "Beaches"]

        // Weather Preference
        weather?: string;            // e.g., "Tropical", "Cold", "Mild"

        // Accommodation Preferences
        stayType?: string;           // e.g., "Hotel", "Hostel", "Resort", "Camping"
    };
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        firstName: {type: String, required: true, minLength: 2, maxLength: 50},
        lastName: {type: String, required: true, minLength: 2, maxLength: 50},
        displayName: {type: String, required: true, minLength: 2, maxLength: 50},
        email: {type: String, required: true, unique: true,maxLength: 50},
        password: {type: String, required: true, minLength: 5, select: false},
        picturePath: {type: String, default: ""},
        travelBuddies: [{type: Schema.Types.ObjectId, ref: "User", default: [] }],
        country: String,
        scoreForLeaderboard: {type: Number, default: 0},
        viewedProfile: {type: Number, default: 0},
        impressions: {type: Number, default: 0},
        preferences: {
            travelStyle: [{ type: String }],
            travelCompanion: { type: String },
            activities: [{ type: String }],
            preferredDestinations: [{ type: String }],
            weather: { type: String },
            stayType: { type: String },
        },
    },
    {timestamps: true}
);

userSchema.pre("save", async function (next){
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export const User = model<IUser>("User", userSchema);


