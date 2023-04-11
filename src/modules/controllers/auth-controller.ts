import { User, UserModel } from "@models/user";
import BaseController from "@modules/controllers/base-controller";
import { Router } from "express";
import { Collection } from "mongodb";
import passport from "passport";
import bcrypt from "bcrypt";
import ensureAuthenticated from "@modules/middleware/ensure-authenticated";
import { tr } from "@modules/services/translator";
import gravatar from "gravatar";
import jsonError from "@modules/middleware/json-error";
import slugify from "slugify";
import { body, checkSchema } from "express-validator";

export default class AuthController extends BaseController {
  listen(router: Router): void {
    router.get("/me", ensureAuthenticated, (req, res) => {
      res.send({ success: true, user: req.user });
    });

    router.post("/logout",ensureAuthenticated, (req, res) => {
      req.logOut((err) => {
        res.send({ success: !err, error: err });
      });
    });

    router.post(
      "/login",
      checkSchema({
        email: {
          isEmail: true,
          errorMessage: tr("Please enter a valid email"),
        },
        password: {
          isLength: {
            options: { min: 6 },
          },
          errorMessage: tr("Password must be at least 6 characters"),
        },
      }),
      (req, res, next) => {
        passport.authenticate("local", (error, user, info) => {
          if (error || !user) {
            res.status(401).send({ success: false, error: info.message });
          } else {
            req.logIn(user, (err) => {
              if (err) {
                res.status(401).send({ success: false, error: err });
              } else {
                res.send({ success: true, user: user });
              }
            });
          }
        })(req, res, next);
      },
      jsonError
    );

    router.post("/register", body("email").isEmail(), (req, res, next) => {
      const { first_name, last_name, email, password, password2 } = req.body;
      let errors: { id: number; msg: string }[] = [];

      if (!first_name || !last_name || !email || !password || !password2) {
        errors.push({ id: 0, msg: tr("Please fill in all fields") });
      }
      //check if match
      if (password !== password2) {
        errors.push({ id: 1, msg: tr("passwords dont match") });
      }

      //check if password is more than 6 characters
      if (password.length < 6) {
        errors.push({ id: 2, msg: tr("password atleast 6 characters") });
      }
      if (errors.length > 0) {
        res.status(403).send({ errors: errors });
      } else {
        UserModel.findOne({ email: email }).then((user) => {
          if (user) {
            errors.push({ id: 3, msg: tr("email already registered") });
            res.status(403).send({ errors: errors });
          } else {
            const avatar = gravatar.url(email);
            const newUser = {
              email,
              first_name,
              last_name,
              password,
              avatar,
              username: slugify(first_name + " " + last_name, {
                lower: true,
              }),
            };
            bcrypt.genSalt(10, (err, salt) =>
              bcrypt.hash(newUser.password, salt, async (err, hash) => {
                if (err) throw err;

                newUser.password = hash;

                await UserModel.create(newUser);

                res.send({
                  success: true,
                  needsEmailConfirmation: true,
                });
              })
            );
          }
        });
      }
    });
  }
}
