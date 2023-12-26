import { Router } from "express";
import { Db } from "mongodb";

export default abstract class BaseController {
  constructor() {}

  listen(router: Router): void {

  }
}
