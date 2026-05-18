import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

type Target = "body" | "query" | "params";

export const validate =
  (schema: ZodSchema, target: Target = "body") =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      const err = result.error as ZodError;
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
