import { Request, Response, Router } from "express";
import BaseController from "./base-controller";
import { CommunityModel, CompanyModel, FollowersModel, UserModel } from "../../resolved-models";
import { FollowService } from "../services/follow";
import { OID } from "../helpers/generate-object-id";
import success from "../responses/success";
import PaginateService from "../services/paginate";

export class FollowerController extends BaseController{
    listen(router: Router): void {
        router.post( "/toggle",this.toggle);
        router.get("/:profileId",this.index);

           

        
    }

    async toggle(req:Request,res:Response){
        const profilID:string = req.body.profilID;
        const followerID:string=req.body.followerID;
        let profileType;
        switch(req.body.profileType){
            case "Community":
                profileType=CommunityModel;
                break;
            case "Company":
                profileType = CompanyModel;
                break;
            case "User":
                profileType=UserModel;
                break;
        }
        const followService = new FollowService(profileType);
        await followService.follow(OID(profilID),OID(followerID));
    }
    async index(req:Request,res:Response){
        const profileId = req.params.profileId;
        const followers =  FollowersModel.find({
            followingId:profileId
        }).populate("follower");
        const paginate = await PaginateService.paginate(req,FollowersModel,followers);
        res.send(success({
            pagination:paginate
        }));

    }
}