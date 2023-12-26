import { NextFunction, Request, Response } from "express";
import { checkSchema } from "express-validator";

export function hasSchema(schema: any) {
  // keys

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const keys = Object.keys(schema);
      const params = req.params;
      const body = req.body;
      const query = req.query;

      for (let key of keys) {
        const value = schema[key];
        if (value?.in == "params") {
          if (!params[key] && value?.default !== undefined) {
            params[key] = value.default;
          }
        } else if (value?.in == "body") {
          if (!body[key] && value?.default !== undefined) {
            body[key] = value.default;
          }
        } else if (value?.in == "query") {
          if (!query[key] && value?.default !== undefined) {
            query[key] = value.default;
          }
        } else {
          if (value?.default !== undefined) {
            if (!params[key]) {
              params[key] = value.default;
            }
            if (!body[key]) {
              body[key] = value.default;
            }
            if (!query[key]) {
              query[key] = value.default;
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
    const errors = (await checkSchema(schema).run(req)).filter(item => !item.isEmpty());
    console.log(req.body)
    if (errors.length > 0) {
      res.status(400).send({
        status: "error",
        success: false,
        errors,
      });
    } else {
      next();
    }
  };
}
