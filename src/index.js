import dotenv from "dotenv"
dotenv.config({
    path:"./.env"
})

import { connectToDB } from "./db/index.js"
import app from "./app.js"

connectToDB()
.then(() => {
    app.listen(process.env.PORT,() => {
        console.log(`App is listening on port ${process.env.PORT}`)
    })
    app.on("error",(error) => {
        console.log(`Error occured while listening on the port: ${error}`)
    })
})
.catch((err) => {
    console.log(`Something went wrong while connecting to DB :${err}`)
    throw err
})