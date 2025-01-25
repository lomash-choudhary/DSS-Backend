import express, { Router } from "express"
import cookieParser from "cookie-parser"
import cors from "cors";
import { Userrouter } from "./routes/user.routes.js";
const app = express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:process.env.LIMIT}))
app.use(cookieParser())

app.use("/api/v1/user", Userrouter)

export default app