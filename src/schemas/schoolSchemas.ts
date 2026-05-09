import { z } from 'zod';

// Zod schema for adding a school
export const addSchoolSchema = z.object({
  name: z.string().min(3).max(255),
  address: z.string().min(5).max(255),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

// Zod schema for listing schools parameters
export const listSchoolsSchema = z.object({
  latitude: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().min(-90).max(90)
  ),
  longitude: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().min(-180).max(180)
  ),
});

// Zod schema for updating a school
export const updateSchoolSchema = z.object({
  id: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().int().positive()
  ),
  name: z.string().min(3).max(255).optional(),
  address: z.string().min(5).max(255).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
}).partial(); // Make all body fields optional

// Zod schema for deleting a school
export const deleteSchoolSchema = z.object({
  id: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().int().positive()
  ),
});

