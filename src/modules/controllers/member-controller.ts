import { Request, Response, Router } from "express";
import BaseController from "./base-controller";
import {
  CommunityModel,
  CompanyModel,
  MembersModel,
  RoleModel,
  UserModel,
} from "../../resolved-models";
import PaginateService from "../services/paginate";
import success from "../responses/success";
import error from "../responses/error";
import { MemberSerivce } from "../services/profiles/member.service";
import { OID } from "../helpers/generate-object-id";
import { tr } from "../services/translator";

export class MemberController extends BaseController {
  listen(router: Router): void {
    router.get("/:profileId", this.index);
    router.post("/toggle", this.toggle);
  }

  async toggle(req: Request, res: Response) {
    try {
      const profileID: string = req.body.profilID;
      const followerID: string = req.body.followerID;
      const roleID: string = req.body.roleID;
      let profileType;
      switch (req.body.profileType) {
        case "Community":
          profileType = CommunityModel;
          break;
        case "Company":
          profileType = CompanyModel;
          break;
        case "User":
          profileType = UserModel;
          break;
      }
      const memberService = new MemberSerivce();

      const profile = await profileType.findById(OID(profileID));

      if (profile) {
        const member = await MembersModel.findOne({
          memberId: followerID,
          profileId: profileID,
        });

        if (member) {
          await memberService.deleteMember(req.user, member);
          res.send(success({ message: tr("Member deleted") }));
        } else {
          const role = await RoleModel.findById(OID(roleID));
          if (role) {
            await memberService.createMember(
              req.user,
              OID(followerID),
              profile,
              role
            );
            res.send(success({ message: tr("Member created") }));
          } else {
            res.send(error(tr("Role not found")));
          }
        }
      }
    } catch (e) {
      res.send(error(e));
    }
  }

  async index(req: Request, res: Response) {
    try {
      const profileId = req.params.profileId;
      const members = MembersModel.find({
        followingId: profileId,
      }).populate("follower");
      const paginate = await PaginateService.paginate(
        req,
        MembersModel,
        members
      );
      res.send(
        success({
          pagination: paginate,
        })
      );
    } catch (e) {
      res.send(error(e));
    }
  }
}
