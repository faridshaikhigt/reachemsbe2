import * as dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config();

const CONNECTION_URL = process.env.CONNECTION_URL;

export const connect_db = async() => {
    if(!CONNECTION_URL){
        console.log("No connection URL found");
    }
    try {
        await mongoose.connect(CONNECTION_URL);
        console.log("Successfully connected to the database.")
    } catch (error) {
        console.log("Can't connect to the database")
    }
}