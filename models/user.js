import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    }, 
    email:{
        type:String,
        required:true
    },
    password:{
        type:String, 
        required:true,
        select:false,
    },
    role:{
        type:String,
        required:true,
        default:"company"
    },
    admin:{
        type: mongoose.ObjectId,
        index: true
    },
    address:{
        type:String, 
    },
    location:{
        type:String,
    }
})


const User = mongoose.model("User", userSchema);

export default User;