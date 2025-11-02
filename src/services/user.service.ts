import { createUserRepo, findOneUserRepo } from "../dataaccess/user.repo.js";
import { ErrorMessages } from "../constants/messages.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUserService = async (data: any) => {
    const exist = await findOneUserRepo({ email: data.email });
    if (exist) throw new Error(ErrorMessages.USER_ALREADY_EXIST);

    const user = await createUserRepo({
        firstName: data.firstName,
        lastName: data.lastName,
        displayName: data.displayName,
        email: data.email,
        password: data.password,
        country: data.country,
    });

    return {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        email: user.email,
        country: user.country,
    };
};


export const loginUserService = async (data: any) => {
    if (!data.email || !data.password) {
        throw new Error("Email and password required");
    }

    const user = await findOneUserRepo({ email: data.email });
    if (!user) throw new Error(ErrorMessages.USER_NOT_FOUND);

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new Error(ErrorMessages.INVALID_CREDENTIALS);


    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET || "supersecretkey",
        { expiresIn: "7d" }
    );
    return {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        email: user.email,
        country: user.country,
        token,
    };
};
