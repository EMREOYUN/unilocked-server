import { Router } from "express";
import BaseController from "./base-controller";

import success from "../responses/success";
import { param, query } from "express-validator";
import ensureAuthenticated from "../middleware/ensure-authenticated";
import {
  UserModel,
  CompanyModel,
  UniversityModel,
  CommunityModel,
  DepartmentModel,
} from "../../resolved-models";

export class SearchController extends BaseController {
  listen(router: Router): void {
    router.get("/global", query("q").isString(), async (req, res, next) => {
      const query = req.query.q as string;

      if (query.length < 3) {
        res.send(success({}));
        return;
      }

      const users = await this.searchUsers(query);
      const companies = await this.searchCompanies(query);
      const universities = await this.searchUniversities(query);
      const communities = await this.searchCommunities(query);

      res.send(
        success({
          users: users,
          companies: companies,
          universities: universities,
          communities: communities,
        })
      );
    });

    router.get(
      "/:type",
      param("type").isString(),
      query("q").isString(),
      async (req, res, next) => {
        const query = req.query.q as string;
        const type = req.params.type as string;

        switch (type) {
          case "users":
            const users = await this.searchUsers(query);
            res.send(
              success({
                users: users,
              })
            );
            break;
          case "companies":
            const companies = await this.searchCompanies(query);
            res.send(
              success({
                companies: companies,
              })
            );
            break;
          case "university":
            const universities = await this.searchUniversities(query);
            res.send(
              success({
                universities: universities,
              })
            );
            break;
          case "communities":
            const communities = await this.searchCommunities(query);
            res.send(
              success({
                communities: communities,
              })
            );
            break;
          case "department":
            const departments = await this.searchDepartments(query);
            res.send(
              success({
                departments: departments,
              })
            );
            break;
          default:
            res.send(success({}));
            break;
        }
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

  private async searchCompanies(query: string) {
    const companies = await CompanyModel.find({
      name: { $regex: query, $options: "i" },
    })
      .limit(20)
      .exec();
    return companies;
  }

  private async searchUniversities(query: string) {
    const universities = await UniversityModel.find({
      name: { $regex: query, $options: "i" },
    })
      .limit(20)
      .exec();
    return universities;
  }

  private async searchCommunities(query: string) {
    const communities = await CommunityModel.find({
      name: { $regex: query, $options: "i" },
    })
      .limit(20)
      .exec();
    return communities;
  }

  public async searchDepartments(query: string) {
    const departments = await DepartmentModel.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { code: { $regex: query, $options: "i" } },
      ],
    })
      .limit(20)
      .exec();
    return departments;
  }
}
