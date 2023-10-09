import { Router } from "express";
import BaseController from "./base-controller";
import { UserModel } from "../../resolved-models";
import success from "../responses/success";
import { query } from "express-validator";
import ensureAuthenticated from "../middleware/ensure-authenticated";

export class SearchController extends BaseController {
  listen(router: Router): void {
    router.get(
      "/global",
      query("q").isString(),
      ensureAuthenticated,
      async (req, res, next) => {
        const query = req.query.q as string;

        const users = await this.searchUsers(query);

       
        res.send(success({
            users: users
        }));
      }
    );
  }

  private async searchUsers(query: string) {
    const users = await UserModel.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    })
      .limit(20)
      .exec();

    return users;
  }
}
