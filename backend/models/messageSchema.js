import mongoose from "mongoose";
import validator from "validator";

const messageSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:[3,"first name must be at least 3 characters"],
    },
    lastName:{
        type:String,
        required:true,
        minLength:[3,"last name must be at least 3 characters"],
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:[validator.isEmail,"please provide a valid email"],
    },
    phone:{
        type:String,
        required:true,
        minLength:[10,"phone number must contain exact 10 digits"],
        maxLength:[10,"phone number must contain exact 10 digits"],
    },
    message:{
        type:String,
        required:true,
        minLength:[10,"message must contain atleast 10 characters"],
    }

});
const Message=mongoose.model("Message",messageSchema);
export default Message;