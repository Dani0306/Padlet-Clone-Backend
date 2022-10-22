import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();

const connect = () => mongoose.connect(process.env.DATABASE_URI).then(() => console.log("Database connected"));

export default connect;