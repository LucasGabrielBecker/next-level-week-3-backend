import express from 'express';
import "./database/connection"
import path from 'path';
import routes from "./routes.ts"
import 'express-async-errors'
import errorHandler from './errors/handler.ts'
import Cors from 'cors';

const app = express();
const PORT = 3333
app.use(express.json())
app.use(Cors())
app.use(routes)
app.use('/uploads', express.static(path.join(__dirname, '..','uploads')))
app.use(errorHandler)

app.listen(PORT, ()=> console.log(`Backend ok on ${PORT}`))