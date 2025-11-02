import { User } from "../models/user.model.js";

export const findOneUserRepo = (filters: any) => {
    return User.findOne(filters).select("+password").exec();
};

export const createUserRepo = (data: any) => {
    return new User(data).save();
};
