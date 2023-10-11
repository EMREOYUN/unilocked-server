import { Router } from "express";
import BaseController from "./base-controller";
import { DepartmentModel, UniversityModel, UserModel } from "../../resolved-models";
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

    router.get("/university", query("q").isString(), async (req, res, next) => {
      const query = req.query.q as string;

      const users = await this.searchUniversities(query);

      res.send(success({
          universities: users
      }));
    });

    router.get("/department", query("q").isString(), async (req, res, next) => {
      const query = req.query.q as string;

      const users = await this.searchDepartments(query);

      res.send(success({
          departments: users
      }));
    });

  }

  private async searchDepartments(query: string) {
    const departments = await DepartmentModel.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { code: { $regex: query, $options: "i" } },
      ],
    })
      .limit(20)
      .exec();

    return departments.map((department) => {
      return department.name
    });
  }

  private async searchUniversities(query: string) {
    const universities = await UniversityModel.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
      ],
    })
      .limit(20)
      .exec();

    return universities.map((university) => {
      return university.name
    });
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
