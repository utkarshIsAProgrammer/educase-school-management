import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import pool from "../config/db";
import {
	addSchoolSchema,
	listSchoolsSchema,
	updateSchoolSchema,
	deleteSchoolSchema,
} from "../schemas/schoolSchemas";
import { School, SchoolWithDistance } from "../types/school";
import { calculateDistance } from "../utils/calculateDistance";

// Adds a new school to the database.
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
		next(error);
	}
};

// Lists schools, optionally sorted by distance from a given point.
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
		next(error);
	}
};

// Updates an existing school's information.
export const updateSchool = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const id = Number(req.params.id);

		if (isNaN(id)) {
			return res.status(400).json({ message: "Invalid school ID" });
		}

		const validatedBody = updateSchoolSchema.partial().parse(req.body);

		const fieldsToUpdate: string[] = [];
		const values: (string | number)[] = [];

		Object.entries(validatedBody).forEach(([key, value]) => {
			if (value !== undefined) {
				fieldsToUpdate.push(`${key} = ?`);
				values.push(value);
			}
		});

		if (fieldsToUpdate.length === 0) {
			return res.status(400).json({
				message: "No fields to update provided.",
			});
		}
		values.push(id);

		const [result] = await pool.execute(
			`UPDATE schools SET ${fieldsToUpdate.join(", ")} WHERE id = ?`,
			values,
		);

		const updateResult = result as { affectedRows?: number };

		if (updateResult.affectedRows === 0) {
			return res.status(404).json({
				message: "School not found.",
			});
		}

		res.status(200).json({
			message: "School updated successfully",
			schoolId: id,
		});
	} catch (error: any) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({
				errors: error.issues,
			});
		}

		next(error);
	}
};

// Deletes a school from the database.
export const deleteSchool = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { id } = deleteSchoolSchema.parse(req.params);

		const [result] = await pool.execute(
			"DELETE FROM schools WHERE id = ?",
			[id],
		);

		const deleteResult = result as { affectedRows?: number };

		if (deleteResult.affectedRows === 0) {
			return res.status(404).json({ message: "School not found." });
		}

		res.status(200).json({
			message: "School deleted successfully",
			schoolId: id,
		});
	} catch (error: any) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({ errors: error.issues });
		}

		next(error);
	}
};
