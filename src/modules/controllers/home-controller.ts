import { Router } from "express";
import BaseController from "./base-controller";
import { PostModel, UserModel } from "../../resolved-models";
import PaginateService from "../services/paginate";
import success from "../responses/success";
import { RedisService } from "../services/redis";
import { Types } from "mongoose";

export default class HomeController extends BaseController {
  listen(router: Router): void {
    router.get("/", async (req, res) => {
      const id = req.user._id;
      
      const user = await UserModel.findById(id).select("+following").exec();
      const following = user.following.map((f) => f._id);

      const posts = PostModel.find({
        $or: [
          {
            "postedBy._id": {
              $in: following,
            },
          },
          { author: id },
        ],
      })
        .populate(["postedBy", "reactions"])
        .populate({
          path: "comments",
          options: {
            sort: {
              createdAt: -1,
            },
            limit: 2,
          },
          populate: {
            path: "author",
            select: "first_name last_name avatar_url",
          },
        })
        .sort({ createdAt: -1 });

      const pagination = await PaginateService.paginate(req, PostModel, posts);

      res.send(success(pagination));
    });
  }
}
