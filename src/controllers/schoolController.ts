import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import pool from "../config/db";
import { addSchoolSchema, listSchoolsSchema, updateSchoolSchema, deleteSchoolSchema } from "../schemas/schoolSchemas";
import { School, SchoolWithDistance } from "../types/school";
import { calculateDistance } from "../utils/calculateDistance";

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

export const updateSchool = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { id } = updateSchoolSchema.shape.id.parse(req.params);
		const validatedBody = updateSchoolSchema.partial().parse(req.body);

		const fieldsToUpdate: string[] = [];
		const values: (string | number)[] = [];

		for (const key in validatedBody) {
			if (validatedBody[key] !== undefined) {
				fieldsToUpdate.push(`${key} = ?`);
				values.push(validatedBody[key] as string | number);
			}
		}

		if (fieldsToUpdate.length === 0) {
			return res.status(400).json({ message: "No fields to update provided." });
		}

		values.push(id);

		const [result] = await pool.execute(
			`UPDATE schools SET ${fieldsToUpdate.join(", ")} WHERE id = ?`,
			values,
		);

		const updateResult = result as { affectedRows?: number };

		if (updateResult.affectedRows === 0) {
			return res.status(404).json({ message: "School not found." });
		}

		res.status(200).json({ message: "School updated successfully", schoolId: id });
	} catch (error: any) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({ errors: error.issues });
		}
		next(error);
	}
};

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

		res.status(200).json({ message: "School deleted successfully", schoolId: id });
	} catch (error: any) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({ errors: error.issues });
		}
		next(error);
	}
};

