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
} from "../../resolved-models";

export class SearchController extends BaseController {
  listen(router: Router): void {
    router.get(
      "/global",
      query("q").isString(),
      ensureAuthenticated,
      async (req, res, next) => {
        const query = req.query.q as string;

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
      }
    );

    router.get(
      "/:type",
      param("type").isString(),
      query("q").isString(),
      ensureAuthenticated,
      async (req, res, next) => {
        const query = req.query.q as string;
        const param = req.query.param as string;

        switch (param) {
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
          case "universities":
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
}
