import { Router } from "express";
import BaseController from "./base-controller";
import ensureAuthorized from "../middleware/ensure-authorized";
import { CompanyModel } from "../../resolved-models";
import mongoose from "mongoose";
import success from "../responses/success";
import PaginateService from "../services/paginate";
import { Company } from "../../models/company";
import { param } from "express-validator";

export default class CompanyController extends BaseController {
    listen(router: Router): void {

        router.get("/", ensureAuthorized("companies.view"), async (req, res, next) => {
            const companies = CompanyModel.find();

            

            res.send(
                success(await PaginateService.paginate(req, CompanyModel, companies))
            );
            next();
        });
        

  
        router.get("/:id", ensureAuthorized("companies.view"), async (req, res, next) => {
            const company = await this.getCompanyById(req.params.id);

            res.send({
                success: true,
                data: company
            });
            next();
        });

        router.post(
        "/create",
        ensureAuthorized("companies.create"),
        async (req, res, next) => {
          const company = await this.createCompany(
            req.user._id,
            req.body.message
          );
  
          res.send({
            success: true,
            data: company,
          });
          next();
        }
      );
      
      router.put(
        "/:id/edit",
        ensureAuthorized("companies.edit"),
        async (req, res, next) => {
          const result = await this.editCompany(req.params.id, req.body.company);
  
          res.send({
            success: true,
            data: result,
          });
          next();
        }
      );

      router.delete(
        "/:id",
        ensureAuthorized("companies.delete"),
        param("id").isMongoId(),
        async (req, res, next) => {
          const company = await this.deleteCompany(req, req.params.id);
  
          res.send({
            success: true,
            data: company,
          });
          next();
        }
      );
  
     
    }
  
    public async getCompanyById(_id: string) {
        return await CompanyModel.findOne({ _id: new mongoose.Types.ObjectId(_id) });
    }
    
    public async createCompany(userID: mongoose.Types.ObjectId, company: Company) {
        const companyModel = new CompanyModel({
            name: company.name,
            description: company.description,
            creator: userID,
            links: company.links,
            sector: company.sector,
            city: company.city,
            address: company.address,
            posts: company.posts
        });

        return await companyModel.save();
    }
    
    public async editCompany(companyID: string, newCompany: Company) {
      const existingCompany = await this.getCompanyById(companyID);
      
      existingCompany.name = newCompany.name;
      existingCompany.description = newCompany.description;
      existingCompany.links = newCompany.links;
      existingCompany.sector = newCompany.sector;
      existingCompany.city = newCompany.city;
      existingCompany.address = newCompany.address;
      existingCompany.posts = newCompany.posts;

      const updatedCompany = await existingCompany.save();
      return updatedCompany;
    }
    
    public async deleteCompany(req: Express.Request, companyID: string) {
        const company = await this.getCompanyById(companyID);

        await company.deleteOne();
        return company;
    }
}