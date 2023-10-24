import { Request, Response, Router } from "express";
import BaseController from "./base-controller";
import { CustomPageModel } from "../../resolved-models";
import PaginateService from "../services/paginate";
import success from "../responses/success";
import authorize from "../services/authorize";
import ensureAuthorized from "../middleware/ensure-authorized";
import { checkSchema, param } from "express-validator";
import { blogSchema } from "../../validators/blog";
import { blogArticlesSeo } from "../seo/blog-articles";
import { blogArticleSeo } from "../seo/blog-article";

export default class BlogController extends BaseController {
  listen(router: Router): void {
    router.get("/", ensureAuthorized("news.view"), this.index);
    router.get(
      "/:id",
      ensureAuthorized("news.view"),
      param("id").isInt(),
      this.show
    );
    router.post("/", ensureAuthorized("news.create"), this.create);
    router.put(
      "/:id",
      ensureAuthorized("news.update"),
      this.update
    );
  }

  async index(req: Request, res: Response) {
    const news = CustomPageModel.find({ type: "blog_article" }).sort({
      _id: -1,
    });
    const paginated = await PaginateService.paginate(
      req,
      CustomPageModel,
      news
    );

    paginated.data = paginated.data.map((item) => {
      item = item.toJSON();
      item.body = item.body.replace(/<[^>]*>?/gm, "");

      return item;
    });
    res.send({
      pagination: paginated,
      seo: blogArticlesSeo(),
    });
  }

  async show(req: Request, res: Response) {
    const news = await CustomPageModel.findOne({
      type: "blog_article",
      id: req.params.id,
    });
    if (!news) {
      return res.status(404).send("Not found");
    }
    res.send({
      article: news?.toObject(),
      seo: blogArticleSeo(news?.toObject()),
    });
  }

  async create(req: Request, res: Response) {
    const lastNews = await CustomPageModel.findOne().sort({ id: -1 }).exec();
    const id = lastNews ? lastNews.id + 1 : 1;

    const news = await CustomPageModel.create({
      type: "blog_article",
      title: req.body.title,
      body: req.body.body,
      user: req.user._id,
      meta: {
        image: req.body.image,
        backdrop: req.body.backdrop,
      },
      id: id,
      slug: req.body.slug,
    });

    res.send(success(news));
  }

  async update(req: Request, res: Response) {
    const news = await CustomPageModel.findOne({
      type: "blog_article",
      id: req.params.id,
    });
    if (authorize(req, "news.update", news)) {
      news.title = req.body.title;
      news.body = req.body.body;
      news.meta = {
        image: req.body.image,
        backdrop: req.body.backdrop,
      };
      news.slug = req.body.slug;
      await news.save();
      res.send(success(news));
    } else {
      res.status(401).send("Unauthorized");
    }
  }
}
