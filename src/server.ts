import express from "express";
import type {Application, Request, Response} from "express";
import dotenv from "dotenv";
import cors from "cors";
import {initDatabase} from "./dataaccess/index.js";
import {routes} from "./routes/index.js";

dotenv.config();
const port = process.env.PORT || 5050;

const app:Application = express();

initDatabase();

app.use(cors());
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({extended:true,limit: "10mb"}));

app.get("/", (req:Request, res:Response)=>{
    res.send("Tripzy Backend Running.....");
});

routes(app);

app.listen(port, ()=> {
    console.log(`Tripzy api server v${process.env.NPM_VERSION} started on PORT ${port}`);
})

