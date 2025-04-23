import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import  authRoute  from './routes/auth-route.js'
import cors from 'cors'
dotenv.config()

const app = express()
const port = process.env.PORT
const string = process.env.MONGO_CONNECTION_STRING
mongoose.connect(string).then(()=>{
    console.log('mongo connected');
}).catch((error)=>{
console.log(error);
});
app.use(cors({
  origin: 'http://localhost:3000', 
}))
app.use(express.json());


app.use('/api/auth', authRoute)




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})