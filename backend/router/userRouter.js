import express from "express";

import { addNewDoctor,logoutPatient,addNewAdmin, getAllDoctors, login,patientRegister,getuserDetails,logoutAdmin } from "../controller/userController.js";
import { isAdminAuthenticated,isPatientAuthenticated } from "../middlewares/auth.js";

const router =express.Router();

router.post("/patient/register",patientRegister);

router.post("/login",login);

router.post("/admin/addnew",isAdminAuthenticated,addNewAdmin);

router.get("/doctors",getAllDoctors);

router.get("/admin/me",isAdminAuthenticated,getuserDetails);

router.get("/patient/me",isPatientAuthenticated,getuserDetails);

router.get("/admin/logout",isAdminAuthenticated,logoutAdmin);

router.get("/patient/logout",isPatientAuthenticated,logoutPatient);

router.post("/doctor/addnew",isAdminAuthenticated,addNewDoctor);
export default router;