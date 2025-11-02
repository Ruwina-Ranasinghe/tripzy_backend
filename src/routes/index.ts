import type {Application, Request, Response} from "express";
import {userRoutes} from "./user.routes.js";

export const routes = (app:Application): void => {
    app.use("/user", userRoutes)
}

