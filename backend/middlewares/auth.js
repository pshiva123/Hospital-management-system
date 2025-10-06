import catchAsyncErrors from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddleware.js";
import jwt from "jsonwebtoken";
import user from "../models/userSchema.js";
export const isAdminAuthenticated=catchAsyncErrors(async(req,res,next)=>{
    const token=req.cookies.adminToken;
    if(!token){
        return next(new ErrorHandler("No admin is authorized",400));
    }
    const decoded= jwt.verify(token,process.env.JWT_SECRET_KEY);
    req.user=await user.findById(decoded.id);
    if(req.user.role!=="Admin"){
        return next(new ErrorHandler("this user is not admin authorized",400));
    }
    next();
});

export const isPatientAuthenticated=catchAsyncErrors(async(req,res,next)=>{
    const token=req.cookies.patientToken;
    if(!token){
        return next(new ErrorHandler("No patient is authorized",400));
    }
    const decoded= jwt.verify(token,process.env.JWT_SECRET_KEY);
    req.user=await user.findById(decoded.id);
    if(req.user.role!=="Patient"){
        return next(new ErrorHandler("this user is not patient authorized",400));
    }
    next();
});
