import { User } from "../../models/user";
import { tr } from "../../modules/services/translator";
import { Request, Response, NextFunction } from "express";

export default function ensureAuthorized(
    permission: string
) {

  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const permissions = new Set<string>(); //To avoid duplicate permissions.

    user?.roles?.forEach((role:any) => {
      role.permissions.forEach(permission => {
        permissions.add(permission); //Get all the permissions the user has.
      })
    });

    
    if (permissions.has(permission) || permissions.has("admin")) {
      return next();
    }

    res
    .status(403)
    .send({ error: "403 Forbidden", message: tr("The user is not authorized to perform this operation.") });
  }
}
