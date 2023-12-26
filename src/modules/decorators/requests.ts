import { NextFunction, Request, Response, Router, RouterOptions } from "express";
import error from "../responses/error";

export function GET(path: string, ...middlewares: any[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata("isRequestDecorator", true, target, propertyKey);
    const originalValue = descriptor.value;
    descriptor.value = function (router: Router) {
      router.get(
        path,
        ...middlewares,
        async (req: Request, res: Response, next: NextFunction) => {
          try {
            await originalValue.apply(this, [req, res, next]);
          } catch (e) {
            console.log("Error in: GET: ", path, e);
            res.status(500).send(error(e));
          }
        }
      );
    };
  };
}

export function POST(path: string, ...middlewares: any[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata("isRequestDecorator", true, target, propertyKey);
    const originalValue = descriptor.value;
    descriptor.value = function (router: Router) {
      router.post(
        path,
        ...middlewares,
        async (req: Request, res: Response, next: NextFunction) => {
          try {
            await originalValue.apply(this, [req, res, next]);
          } catch (error) {
            console.log(error);
            res.status(500).json({ error });
          }
        }
      );
    };
  };
}

export function PUT(path: string, ...middlewares: any[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata("isRequestDecorator", true, target, propertyKey);
    const originalValue = descriptor.value;
    descriptor.value = function (router:Router) {
      router.put(
        path,
        ...middlewares,
        async (req: Request, res: Response, next: NextFunction) => {
          try {
            await originalValue.apply(this, [req, res, next]);
          } catch (error) {
            console.log(error);
            res.status(500).json({ error });
          }
        }
      );
    };
  };
}

export function DELETE(path: string, ...middlewares: any[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata("isRequestDecorator", true, target, propertyKey);
    const originalValue = descriptor.value;
    descriptor.value = function (router:Router) {
      router.delete(
        path,
        ...middlewares,
        async (req: Request, res: Response, next: NextFunction) => {
          try {
            await originalValue.apply(this, [req, res, next]);
          } catch (error) {
            console.log(error);
            res.status(500).json({ error });
          }
        }
      );
    };
  };
}
