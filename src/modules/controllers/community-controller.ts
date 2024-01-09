import { Response, Router } from "express";
import BaseController from "./base-controller";
import { CommunityModel } from "../../resolved-models";
import {  follow } from "../services/follow";
import { param } from "express-validator";
import success from "../responses/success";

export default class CommunityController extends BaseController {
  listen(router: Router): void {
    
    
  }

  
}
