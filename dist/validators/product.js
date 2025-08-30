"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    sku: zod_1.z.string().min(1).max(64),
    name: zod_1.z.string().min(1).max(200),
    price: zod_1.z.coerce.number().positive().multipleOf(0.01)
});
exports.updateProductSchema = zod_1.z.object({
    sku: zod_1.z.string().min(1).max(64).optional(),
    name: zod_1.z.string().min(1).max(200).optional(),
    price: zod_1.z.coerce.number().positive().multipleOf(0.01).optional()
});
