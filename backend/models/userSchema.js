
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema=new mongoose.Schema({
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
    nic:{
        type:String,
        required:true,
        minLength:[12,"aadhar number must contain  12 characters"],
        maxLength:[12,"aadhar number must contain 12 characters"]
    },
    dob:{
        type:Date,
        required:true,

    },
    gender:{
        type:String,
        required:true,
        enum:["male","female"],
    },
    password:{
        type:String,
        required:true,
        minLength:[8,"password must contain at least 8 characters"],
        select:false,
    },
    role:{
        type:String,
        required:true,
        enum:["Admin","Patient","Doctor",]
    },
    doctorDepartment:{
        type:String,
    },
    docAvatar:{
        public_id:String,
        url:String,

    }

});

userSchema.pre("save",async function(next){
    if((!this.isModified("password"))){
        next();
    }
    this.password=await bcrypt.hash(this.password,10);
});
userSchema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}
userSchema.methods.generateJsonWebToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{expiresIn:process.env.JWT_EXPIRES});
}
const User=mongoose.model("User",userSchema);
export default User;
