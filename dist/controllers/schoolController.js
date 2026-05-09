"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSchools = exports.addSchool = void 0;
const zod_1 = require("zod");
const db_1 = __importDefault(require("../config/db"));
const schoolSchemas_1 = require("../schemas/schoolSchemas");
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
            const distance = calculateDistance(userLat, userLon, school.latitude, school.longitude);
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
// Haversine formula to calculate distance between two lat/lon points
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}
