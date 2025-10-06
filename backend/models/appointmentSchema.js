import mongoose from "mongoose";
import validator from "validator";



const appointmentSchema=new mongoose.Schema({
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
    appointment_date:{
        type:String,
        required:true,
    },
    department:{
        type:String,
        required:true,
    },
    doctor:{
        firstName:{
            type:String,
            required:true,
        },
        lastName:{
            type:String,
            required:true,
        }
    },
    hasVisited:{
        type:Boolean,
        default:false,
    },
    doctorId:{
        type:mongoose.Schema.ObjectId,
        required:true,
    },
    patientId:{
        type:mongoose.Schema.ObjectId,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:["pending","accepted","rejected"],
        default:"pending",
    }

   
});


const Appointment=mongoose.model("Appointment",appointmentSchema);
export default Appointment;
