"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema, target = "body") => (req, res, next) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
        const err = result.error;
        res.status(422).json({
            success: false,
            message: "Validation failed",
            errors: err.issues.map((e) => ({
                field: e.path.join("."),
                message: e.message,
            })),
        });
        return;
    }
    req[target] = result.data;
    next();
};
exports.validate = validate;
//# sourceMappingURL=validate.middleware.js.map