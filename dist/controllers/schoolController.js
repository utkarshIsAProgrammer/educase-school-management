"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSchool = exports.updateSchool = exports.listSchools = exports.addSchool = void 0;
const zod_1 = require("zod");
const db_1 = __importDefault(require("../config/db"));
const schoolSchemas_1 = require("../schemas/schoolSchemas");
const calculateDistance_1 = require("../utils/calculateDistance");
const addSchool = async (req, res, next) => {
    try {
        const validatedData = schoolSchemas_1.addSchoolSchema.parse(req.body);
        const { name, address, latitude, longitude } = validatedData;
        const [result] = await db_1.default.execute("INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)", [name, address, latitude, longitude]);
        const insertResult = result;
        res.status(201).json({
            message: "School added successfully",
            schoolId: insertResult.insertId,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        next(error); // Pass other errors to the centralized error handler
    }
};
exports.addSchool = addSchool;
const listSchools = async (req, res, next) => {
    try {
        const validatedParams = schoolSchemas_1.listSchoolsSchema.parse(req.query);
        const { latitude: userLat, longitude: userLon } = validatedParams;
        const [rows] = await db_1.default.execute("SELECT id, name, address, latitude, longitude FROM schools");
        const schoolsWithDistance = rows.map((school) => {
            const distance = (0, calculateDistance_1.calculateDistance)(userLat, userLon, school.latitude, school.longitude);
            return { ...school, distance };
        });
        schoolsWithDistance.sort((a, b) => a.distance - b.distance);
        res.status(200).json(schoolsWithDistance);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        next(error); // Pass other errors to the centralized error handler
    }
};
exports.listSchools = listSchools;
const updateSchool = async (req, res, next) => {
    try {
        const { id } = schoolSchemas_1.updateSchoolSchema.shape.id.parse(req.params);
        const validatedBody = schoolSchemas_1.updateSchoolSchema.partial().parse(req.body);
        const fieldsToUpdate = [];
        const values = [];
        for (const key in validatedBody) {
            if (validatedBody[key] !== undefined) {
                fieldsToUpdate.push(`${key} = ?`);
                values.push(validatedBody[key]);
            }
        }
        if (fieldsToUpdate.length === 0) {
            return res.status(400).json({ message: "No fields to update provided." });
        }
        values.push(id);
        const [result] = await db_1.default.execute(`UPDATE schools SET ${fieldsToUpdate.join(", ")} WHERE id = ?`, values);
        const updateResult = result;
        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ message: "School not found." });
        }
        res.status(200).json({ message: "School updated successfully", schoolId: id });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        next(error);
    }
};
exports.updateSchool = updateSchool;
const deleteSchool = async (req, res, next) => {
    try {
        const { id } = schoolSchemas_1.deleteSchoolSchema.parse(req.params);
        const [result] = await db_1.default.execute("DELETE FROM schools WHERE id = ?", [id]);
        const deleteResult = result;
        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ message: "School not found." });
        }
        res.status(200).json({ message: "School deleted successfully", schoolId: id });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        next(error);
    }
};
exports.deleteSchool = deleteSchool;
