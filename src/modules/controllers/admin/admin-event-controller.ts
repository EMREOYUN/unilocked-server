import { Request, Response, Router } from "express";
import BaseController from "../base-controller";
import authorize from "../../services/authorize";
import { EventModel, EventViewsModel } from "../../../resolved-models";
import { OID } from "../../helpers/generate-object-id";
import { param } from "express-validator";

export class AdminEventContoller extends BaseController {
    listen(router: Router): void {
        router.get("/:id", param("id").isMongoId(), this.show);


    }
    async show(req: Request, res: Response) {
        const event = await EventModel.findById(OID(req.params.id));
        const authorized = authorize(req, "event.edit", event);
        if (!authorized) {

            return res.status(403).send({
                success: false,
                message: "The User is not authorized to perform this action",
            });
        }
        const currentDate = new Date();
        const lastWeekDate = new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000);
        const nextWeekDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        const eventViews = EventViewsModel.find({ date: { $gt: lastWeekDate, $lt: nextWeekDate } });
        const eventViewCount = await eventViews.count();
        const eventParticipateCount = event.participants.length;
        res.send({
            succes: true,
            data: {
                event: event,
                eventViewCount: eventViewCount,
                eventParticipateCount: eventParticipateCount,
            }
        });



    }
}