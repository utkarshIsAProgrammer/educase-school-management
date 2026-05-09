import express from "express";
import {
	addSchool,
	listSchools,
	updateSchool,
	deleteSchool,
} from "../controllers/schoolController";

const router = express.Router();

router.post("/addSchool", addSchool);
router.get("/listSchools", listSchools);
router.put("/updateSchool/:id", updateSchool);
router.delete("/deleteSchool/:id", deleteSchool);

export default router;
