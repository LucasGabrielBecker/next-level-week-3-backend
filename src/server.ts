import express from 'express';
import "./database/connection"
import path from 'path';
import routes from "./routes.ts"
import 'express-async-errors'
import errorHandler from './errors/handler.ts'
import Cors from 'cors';
import mongoose from "mongoose"


mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@nodeapi.78anz.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`, {useNewUrlParser: true,useUnifiedTopology: true })



const app = express();
const PORT = 3333
app.use(express.json())
app.use(Cors())
app.use(routes)
app.use('/uploads', express.static(path.join(__dirname, '..','uploads')))
app.use(errorHandler)

app.listen(PORT, ()=> console.log(`Backend ok on ${PORT}`))