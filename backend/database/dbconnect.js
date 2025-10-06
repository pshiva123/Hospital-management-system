import mongoose from "mongoose";

export const dbconnect=()=>{
    mongoose.connect(process.env.MONGO_URL,{
        dbName:"hospital_management_system",

    }).then(()=>{
        console.log("database connection setup scuccess");
    }).catch((err)=>{
        console.log("database connection failed "+err)
    })

}