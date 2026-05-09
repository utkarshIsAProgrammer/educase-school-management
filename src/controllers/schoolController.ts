import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import pool from "../config/db";
import { addSchoolSchema, listSchoolsSchema } from "../schemas/schoolSchemas";
import { School, SchoolWithDistance } from "../types/school";

export const addSchool = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const validatedData = addSchoolSchema.parse(req.body);
		const { name, address, latitude, longitude } = validatedData;

		const [result] = await pool.execute(
			"INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
			[name, address, latitude, longitude],
		);

		const insertResult = result as { insertId?: number };

		res.status(201).json({
			message: "School added successfully",
			schoolId: insertResult.insertId,
		});
	} catch (error: any) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({ errors: error.issues });
		}
		next(error); // Pass other errors to the centralized error handler
	}
};

export const listSchools = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const validatedParams = listSchoolsSchema.parse(req.query);
		const { latitude: userLat, longitude: userLon } = validatedParams;

		const [rows] = await pool.execute<School[]>(
			"SELECT id, name, address, latitude, longitude FROM schools",
		);

		const schoolsWithDistance: SchoolWithDistance[] = rows.map((school) => {
			const distance = calculateDistance(
				userLat,
				userLon,
				school.latitude,
				school.longitude,
			);
			return { ...school, distance };
		});

		schoolsWithDistance.sort((a, b) => a.distance - b.distance);

		res.status(200).json(schoolsWithDistance);
	} catch (error: any) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({ errors: error.issues });
		}
		next(error); // Pass other errors to the centralized error handler
	}
};

// Haversine formula to calculate distance between two lat/lon points
function calculateDistance(
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number,
): number {
	const R = 6371; // Radius of Earth in kilometers
	const dLat = ((lat2 - lat1) * Math.PI) / 180;
	const dLon = ((lon2 - lon1) * Math.PI) / 180;
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((lat1 * Math.PI) / 180) *
			Math.cos((lat2 * Math.PI) / 180) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const distance = R * c;
	return distance;
}
