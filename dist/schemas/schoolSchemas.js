"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSchoolSchema = exports.updateSchoolSchema = exports.listSchoolsSchema = exports.addSchoolSchema = void 0;
const zod_1 = require("zod");
// Zod schema for adding a school
exports.addSchoolSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(255),
    address: zod_1.z.string().min(5).max(255),
    latitude: zod_1.z.number().min(-90).max(90),
    longitude: zod_1.z.number().min(-180).max(180),
});
// Zod schema for listing schools parameters
exports.listSchoolsSchema = zod_1.z.object({
    latitude: zod_1.z.preprocess((a) => parseFloat(zod_1.z.string().parse(a)), zod_1.z.number().min(-90).max(90)),
    longitude: zod_1.z.preprocess((a) => parseFloat(zod_1.z.string().parse(a)), zod_1.z.number().min(-180).max(180)),
});
// Zod schema for updating a school
exports.updateSchoolSchema = zod_1.z.object({
    id: zod_1.z.preprocess((a) => parseInt(zod_1.z.string().parse(a), 10), zod_1.z.number().int().positive()),
    name: zod_1.z.string().min(3).max(255).optional(),
    address: zod_1.z.string().min(5).max(255).optional(),
    latitude: zod_1.z.number().min(-90).max(90).optional(),
    longitude: zod_1.z.number().min(-180).max(180).optional(),
}).partial(); // Make all body fields optional
// Zod schema for deleting a school
exports.deleteSchoolSchema = zod_1.z.object({
    id: zod_1.z.preprocess((a) => parseInt(zod_1.z.string().parse(a), 10), zod_1.z.number().int().positive()),
});
