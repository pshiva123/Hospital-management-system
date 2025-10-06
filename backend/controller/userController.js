import user from "../models/userSchema.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { generateToken } from "../utils/jwtTokens.js";
import cloudinary from "cloudinary";
export const patientRegister=catchAsyncErrors(async(req,res,next)=>{
    const {firstName,lastName,email,phone,password,dob,gender,nic,role}=req.body;
    if(!firstName || !lastName || !email || !phone || !password || !dob || !gender || !nic || !role){
        return next(new ErrorHandler("please fill full form",400))
    }
    let newuser=await user.findOne({email});
    if(newuser){
        return next(new ErrorHandler("user already exist",400));
    }
    newuser =await user.create({firstName,lastName,email,phone,password,dob,gender,nic,role});
    generateToken(newuser,"User registered successfully",200,res);
});
export const login=catchAsyncErrors(async(req,res,next)=>{
    const {email,password,confirmPassword,role}=req.body;
    if(!email || !password || !confirmPassword || !role){
        return next(new ErrorHandler("please fill all fields",400))
    }
    if(password!==confirmPassword){
        return next(new ErrorHandler("passwords not marched",400))
    }
    const existingUser=await user.findOne({email}).select("+password");
    if(!existingUser){
        return next(new ErrorHandler("user not found,please register",404));
    }
    const ispasswordMatched=await existingUser.comparePassword(password);
    if(!ispasswordMatched){
        return next(new ErrorHandler("invalid password",400));
    }
    if(role!=existingUser.role){
        return next(new ErrorHandler("user with this role not found",400))
    }
    generateToken(existingUser,"User login successful",200,res);
    
});
export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, password, gender, dob, nic } = req.body;
    if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic) {
        return next(new ErrorHandler("Please fill the full form", 400));
    }

    const isRegistered = await user.findOne({ email });
    if (isRegistered) {
        return next(new ErrorHandler(`${isRegistered.role} with this email already exists`, 400));
    }

    // This is the correct way
    const admin = new user({
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        role: "Admin",
    });
    await admin.save(); // .save() triggers the pre-save hook to hash the password

    res.status(200).json({
        success: true,
        message: "New Admin registered successfully!",
    });
});
export const getAllDoctors=catchAsyncErrors(async(req,res,next)=>{
    const doctors=await user.find({role:"Doctor"});
    res.status(200).json({
        success:true,
        doctors
    });
});

export const getuserDetails=catchAsyncErrors(async(req,res,next)=>{
    const userDetails=req.user;
    res.status(200).json({
        success:true,
        userDetails
    });
});

export const logoutAdmin=catchAsyncErrors(async(req,res,next)=>{
    res.status(200).cookie("adminToken",null,{
        httpOnly:true,
        expires:new Date(Date.now()),
    }).json({success:true,
          message:"Admin logged out successfully"
        });
});
export const logoutPatient=catchAsyncErrors(async(req,res,next)=>{
    res.status(200).cookie("patientToken",null,{
        httpOnly:true,
        expires:new Date(Date.now()),
    }).json({success:true,
          message:"Patient logged out successfully"
        });
});
export const addNewDoctor=catchAsyncErrors(async(req,res,next)=>{
    console.log(req.body);
    if(!req.files || Object.keys(req.files).length===0 ){
        return next(new ErrorHandler("please upload the image",400))
    }
    const { docAvatar } = req.files;
    const allowedfiletypes=["image/jpeg","image/jpg","image/png","image/webp"];
    if(!allowedfiletypes.includes(docAvatar.mimetype)){
        return next(new ErrorHandler("invalid file type",400))
    }
    const {firstName,lastName,email,phone,password,gender,dob,nic,doctorDepartment}=req.body;
    if(!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic || !doctorDepartment){
        return next(new ErrorHandler("Please fill all fields",400));
    }
    const isRegistered=await user.findOne({email});
    if(isRegistered){
        return next(new ErrorHandler("Doctor with this email already exists",400));
    }
    const cloudinaryResponse=await cloudinary.uploader.upload(docAvatar.tempFilePath);
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error("cloudinary error",cloudinaryResponse.error || "Unknown error");
    }
    const doctor=new user({
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        doctorDepartment,
        role:"Doctor",
        docAvatar:{
            public_id:cloudinaryResponse.public_id,
            url:cloudinaryResponse.secure_url,
        }
    });
    await doctor.save();
    res.status(201).json({
        success:true,
        message:"Doctor added successfully",
        doctor
    });
})
