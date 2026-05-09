"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const schoolController_1 = require("../controllers/schoolController");
const router = express_1.default.Router();
router.post("/addSchool", schoolController_1.addSchool);
router.get("/listSchools", schoolController_1.listSchools);
exports.default = router;
