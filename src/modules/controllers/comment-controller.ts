
import { OID } from "../../modules/helpers/generate-object-id";
import { Router } from "express";
import { use } from "passport";
import BaseController from "./base-controller";
import { body, checkSchema, param } from "express-validator";
import { tr } from "../../modules/services/translator";
import ensureAuthorized from "../../modules/middleware/ensure-authorized";
import { Mongoose, Types } from "mongoose";
import authorize from "../../modules/services/authorize";
import { CommentModel, PostModel } from "../../resolved-models";

export default class CommentController extends BaseController {
  
  listen(router: Router): void {
    router.post(
      "/:id",
      ensureAuthorized("comments.create"),
      checkSchema({
        message: {
          isLength: {
            options: { min: 1 },
          },
          errorMessage: tr("Comment must be at least 1 character"),
        },
        id: {
          isMongoId: true,
          errorMessage: tr("Invalid post id"),
        },
      }),
      async (req, res, next) => {
        const comment = await this.createComment(
          req.params.id,
          req.user._id,
          req.body.message
        );

        res.send({
          success: true,
          data: comment,
        });
        next();
      }
    );

    router.delete(
      "/:id",
      ensureAuthorized("comments.view"),
      param("id").isMongoId(),
      async (req, res, next) => {
        const result = await this.deleteComment(req, req.params.id);

        res.send({
          success: true,
          data: result,
        });
        next();
      }
    );

    router.post(
      "/:id/edit",
      ensureAuthorized("comments.view"),
      checkSchema({
        message: {
          isLength: {
            options: { min: 1 },
          },
          errorMessage: tr("Comment must be at least 1 character"),
        },
        id: {
          isMongoId: true,
          errorMessage: tr("Invalid post id"),
        },
      }),
      async (req, res, next) => {
        const result = await this.editComment(
          req.user._id,
          req.params.id,
          req.body.message
        );

        res.send({
          success: true,
          data: result,
        });
        next();
      }
    );

    router.post(
      "/:id/:reaction",
      ensureAuthorized("comments.view"),
      checkSchema({
        id: {
          isMongoId: true,
          errorMessage: tr("Invalid post id"),
        },
        reaction: {
          isString: true,
          errorMessage: tr("Invalid reaction"),
        },
      }),
      async (req, res, next) => {
        if (req.params.reaction !== "like" && req.params.reaction !== "dislike")
          res.status(404).send({ success: false, error: "Invalid reaction" });
        else {
          const result = await this.addReaction(
            req.user,
            req.params.id,
            req.params.reaction
          );
          res.send({ success: true, user: req.user });
          next();
        }
      }
    );
  }

  private async deleteComment(req: Express.Request, commentID: string) {
    const comment = await CommentModel.findById(OID(commentID));

    if (authorize(req, "comments.delete", comment, "author")) {
      await comment.deleteOne();
      await PostModel.updateOne(
        { _id: comment.post },
        { $pull: { comments: OID(commentID) } }
      );
      return true;
    }

    return comment;
  }

  //edit comment
  public async editComment(
    request: Express.Request,
    commentID: string,
    message: string
  ) {
    this.validateComment(message);
    const comment = await CommentModel.findById(OID(commentID));

    if (authorize(request, "comments.edit", comment, "author")) {
      comment.text = message;
      comment.edited = true;
      const updatedComment = await comment.save();
      return updatedComment;
    }

    return null;
  }

  private async createComment(postID: string, userID, message: string) {
    this.validateComment(message);

    const newComment = new CommentModel({
      post: OID(postID),
      author: userID,
      text: message,
    });

    const savedComment = await newComment.save();

    //Add comment to post
    await PostModel.updateOne(
      { _id: OID(postID) },
      { $push: { comments: savedComment._id } }
    );

    return savedComment;
  }

  // Be sure message length is more than 4 and less than 250
  private async validateComment(message: string) {
    if (message.length < 4 || message.length > 250) {
      throw new Error("Comment must be between 4 and 250 characters");
    }
    // Check for bad words
    // ...
  }

  public async addReaction(userID, postID: string, reaction: string) {
    const comment = await CommentModel.findOne({
      _id: OID(postID),
    })
      .populate({
        path: reaction,
        match: {
          _id: userID,
        },
      })
      .exec();

    if (reaction === "like") {
      await CommentModel.updateOne(
        { _id: OID(postID) },
        comment.likes.length === 0
          ? { $push: { likes: userID } }
          : { $pull: { likes: userID } }
      );
    } else {
      //Dislike
      await CommentModel.updateOne(
        { _id: OID(postID) },
        comment.dislikes.length === 0
          ? { $push: { dislikes: userID } }
          : { $pull: { dislikes: userID } }
      );
    }
  }
}
