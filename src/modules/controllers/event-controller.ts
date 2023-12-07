import { Router } from "express";
import { param, checkSchema } from "express-validator";
import mongoose from "mongoose";

import { OID } from "../helpers/generate-object-id";
import ensureAuthorized from "../middleware/ensure-authorized";
import success from "../responses/success";
import PaginateService from "../services/paginate";
import BaseController from "./base-controller";
import authorize from "../services/authorize";
import { EventModel, UserModel, UniversityModel, EventViewsModel } from "../../resolved-models";
import { EventViews } from "../../models/relations/events/events-views";
import checkProfilePermission from "../services/check-profile-permission";




export class EventController extends BaseController {
  listen(router: Router): void {
    //Get events
    router.get("/", ensureAuthorized("events.view"), async (req, res, next) => {
      const events = EventModel.find();

      res.send(
        success(await PaginateService.paginate(req, EventModel, events))
      );
      next();
    });

    //Get event by ID
    router.get(
      "/:id",
      ensureAuthorized("events.view"),
      param("id").isMongoId(),
      async (req, res, next) => {
        const event = await this.byIdExpanded(req.params.id);
        const oldEventView = await EventViewsModel.findOne({ user: req.user._id });
        if (!oldEventView) {
          const eventView = new EventViewsModel();
          eventView.event = event._id;
          eventView.user = req.user._id;
          await eventView.save();
        }


        res.send({
          success: true,
          data: event,
        });
        next();
      }
    );

    //Create new event
    router.post(
      "/create",
      ensureAuthorized("events.view"),
      checkSchema({
        event: {
          in: "body",
          isObject: true,
          custom: {
            options: (value) => {
              return (
                value.name &&
                value.description &&
                value.date &&
                value.university
              );
            },
          },
        },
      }),
      async (req, res, next) => {
        const event = await this.createEvent(req.user._id, req.body.event);

        res.send({
          success: true,
          data: event,
        });
        next();
      }
    );

    //Edit an existing event
    router.put(
      "/:id/edit",
      ensureAuthorized("events.view"),
      checkSchema({
        event: {
          in: "body",
          isObject: true,
          custom: {
            options: (value) => {
              return (
                value.name &&
                value.description &&
                value.date &&
                value.university
              );
            },
          },
        },
      }),
      async (req, res, next) => {
        const event = await this.editEvent(
          req.user._id,
          req.params.id,
          req.body.event
        );

        res.send({
          success: true,
          data: event,
        });
        next();
      }
    );

    //Delete an event
    router.delete(
      "/:id/delete",
      ensureAuthorized("events.view"),
      param("id").isMongoId(),
      async (req, res, next) => {
        const event = await this.deleteEvent(req, req.params.id);

        res.send({
          success: true,
          data: event,
        });
        next();
      }
    );

    //Participate in an event
    router.post(
      "/:id/participate",
      ensureAuthorized("events.view"),
      param("id").isMongoId(),
      async (req, res, next) => {
        const event = await this.participate(req.user._id, req.params.id);

        res.send({
          success: true,
          data: event,
        });
        next();
      }
    );

    //Leave an event
    router.post(
      "/:id/leave",
      ensureAuthorized("events.view"),
      param("id").isMongoId(),
      async (req, res, next) => {
        const event = await this.leave(req.user._id, req.params.id);

        res.send({
          success: true,
          data: event,
        });
        next();
      }
    );

    //List the participants of the event
    router.get(
      "/:id/participants",
      ensureAuthorized("events.view"),
      param("id").isMongoId(),
      async (req, res, next) => {
        const participants = await this.participants(req.params.id);

        res.send({
          success: true,
          data: participants,
        });
        next();
      }
    );

    // Get the subevents of the event.
    router.get(
      "/:id/subevents",
      ensureAuthorized("events.view"),
      param("id").isMongoId(),
      async (req, res, next) => {
        const event = await this.byId(req.params.id);

        res.send({
          success: true,
          data: event.subEvents,
        });
        next();
      }
    );

    // Change the order of the subevents from the request body.
    router.put(
      "/:id/subevents",
      ensureAuthorized("events.view"),
      param("id").isMongoId(),
      checkSchema({
        subEvents: {
          in: "body",
          isArray: true,
          custom: {
            options: (value) => {
              return value.every((subEvent) => {
                return subEvent.name && subEvent.date;
              });
            },
          },
        },
      }),
      async (req, res, next) => {
        const event = await this.changeSubEventOrder(
          req.params.id,
          req.body.subEvents
        );

        res.send({
          success: true,
          data: event,
        });
        next();
      }
    );
    
    // Get sponsor names of the event.
    router.get(
      "/:id/sponsor",
      ensureAuthorized("events.view"),
      param("id").isMongoId(),
      async (req, res, next) => {
        const event = await this.byId(req.params.id);
        res.send({
          success: true,
          data: event.sponsors,
        });
        next();
      }
    );

    // Edit sponsor count and names.
    router.put(
      "/:id/sponsor",
      ensureAuthorized("events.view"),
      param("id").isMongoId(),
      checkSchema({
        sponsorNames: {
          in: "body",
          isArray: true,
          custom: {
            options: (value) => {
              return value.every((name) => {
                return name;
              });
            },
          },
        },
      }),
      async (req, res, next) => {
        const event = await this.editSponsor(
          req.params.id,
          req.body.sponsorNames
        );
        
        res.send({
          success: true,
          data: event,
        });
        next();
      }
    );

    // Add a user as permissioned user using member service.
    router.post(
      "/:id/add-permissioned-user",
      ensureAuthorized("events.view"),
      param("id").isMongoId(),
      checkSchema({
        userID: {
          in: "body",
          isMongoId: true,
        },
        role: {
          in: "body",
          isString: true,
        },
      }),
      async (req, res, next) => {
        const event = await this.addPermissionedUser(
          req.params.id,
          req.body.userID,
          req.body.role
        );

        res.send({
          success: true,
          data: event,
        });
        next();
      }
    )

    // Get partner names of the event.
    router.get(
      "/:id/partner",
      ensureAuthorized("events.view"),
      param("id").isMongoId(),
      async (req, res, next) => {
        const event = await this.byId(req.params.id);
        res.send({
          success: true,
          data: event.partners,
        });
        next();
      }
    );

    // Edit partner count and names.
    router.put(
      "/:id/partner",
      ensureAuthorized("events.view"),
      param("id").isMongoId(),
      checkSchema({
        partnerNames: {
          in: "body",
          isArray: true,
          custom: {
            options: (value) => {
              return value.every((name) => {
                return name;
              });
            },
          },
        },
      }),
      async (req, res, next) => {
        const event = await this.editPartner(
          req.params.id,
          req.body.partnerNames
        );
        
        res.send({
          success: true,
          data: event,
        });
        next();
      }
    );
  }

  public byId(_id: string) {
    return EventModel.findOne({ _id: new mongoose.Types.ObjectId(_id) });
  }

  //Same with the byId, except this method's result contain some information about creator and organizators.
  public byIdExpanded(_id: string) {
    return EventModel.findOne({ _id: new mongoose.Types.ObjectId(_id) })
      .populate([
        { path: "creator", select: ["username", "first_name", "last_name"] },
        { path: "organizator", select: ["name", "icon_url"] },
      ])
      .exec();
  }

  public async createEvent(userID, event) {
    const eventModel = new EventModel({
      name: event.name,
      description: event.description,
      creator: userID,
      organizatorId: event.organizatorID,
      organizatorType: event.organizatorType, // An event can be created by a university or a company or directly by the user.
      eventDate: event.eventDate,
      location: event.location,
    });
    const savedEvent = await eventModel.save(); //Save the event to the DB.

    //Add the event to the events that the user participates in.
    UserModel.updateOne(
      { _id: OID(userID) },
      { $push: { createdEvents: savedEvent._id } }
    );

    //Add the event to the events that the university arrange.
    //TODO: Ask user to is is connected to a university or a company.
    UniversityModel.updateOne(
      { _id: savedEvent.organizator },
      { $push: { events: savedEvent._id } }
    );

    return savedEvent;
  }

  public async editEvent(req: Express.Request, eventID: string, newEvent) {
    const existingEvent = await this.byId(eventID);

    if (authorize(req, "events.edit", existingEvent, "creator")) {
      existingEvent.name = newEvent.name;
      existingEvent.description = newEvent.description;
      existingEvent.creator = existingEvent.creator;
      existingEvent.organizator = newEvent.organizatorID;
      existingEvent.eventDate = newEvent.eventDate;
      existingEvent.location = newEvent.location;
      const updatedEvent = await existingEvent.save();
      return updatedEvent;
    }
    return existingEvent;
  }

  public async deleteEvent(req: Express.Request, eventID) {
    const event = await this.byId(eventID);

    //Delete the event from the participants' participatedEvents fields.
    if (authorize(req, "events.delete", event, "creator")) {
      const creator = event.creator;
      const participants = event.participants;
      participants.forEach(async (participant) => {
        await UserModel.updateOne(
          { _id: participant },
          { $pull: { participatedEvents: OID(eventID) } }
        );
      });

      //Delete the event from the creator's createdEvent field.
      await UserModel.updateOne(
        { _id: creator },
        { $pull: { createdEvents: OID(eventID) } }
      );

      //Delete the event from the universities' events fields.
      await UniversityModel.updateOne(
        { _id: event.organizator },
        { $pull: { events: event._id } }
      );

      await event.deleteOne(); //Delete the event from the DB.
      return event;
    }
    return null;
  }

  public async participate(userID, eventID) {
    const event = await this.byId(eventID);
    if (event.participants.includes(OID(userID))) return event; //Already participated.

    //Add the event to the participatedEvents field of the participant.
    await UserModel.updateOne(
      { _id: userID },
      { $push: { participatedEvents: event._id } }
    );

    //Add the participant to the participants field of the event.
    await EventModel.updateOne(
      { _id: event._id },
      { $push: { participants: OID(userID) } }
    );

    return event;
  }

  public async leave(userID, eventID) {
    const event = await this.byId(eventID);
    if (!event.participants.includes(OID(userID)))
      throw new Error("User is not a participant.");

    //Remove the event from the participatedEvents field of the participant.
    await UserModel.updateOne(
      { _id: userID },
      { $pull: { participatedEvents: event._id } }
    );

    //Remove the participant from the participants field of the event.
    await EventModel.updateOne(
      { _id: event._id },
      { $pull: { participants: OID(userID) } }
    );

    return event;
  }

  public async participants(eventID) {
    return EventModel.findOne({ _id: OID(eventID) })
      .select("participants")
      .populate({
        path: "participants",
        select: ["username", "first_name", "last_name", "avatar_url"],
        options: {},
      })
      .exec();
  }

  public async featuredPosts(eventID) {
    return EventModel.findOne({ _id: OID(eventID) })
      .select("featuredPosts")
      .populate({
        path: "featuredPosts",
        select: ["title", "content", "creator", "createdAt"],
        options: {},
      })
      .exec();
  }

  public async addFeaturedPost(eventID, postID) {
    const event = await this.byId(eventID);
    if (event.featuredPosts.includes(OID(postID))) return event; //Already featured.

    //Add the post to the featuredPosts field of the event.
    await EventModel.updateOne(
      { _id: event._id },
      { $push: { featuredPosts: OID(postID) } }
    );

    return event;
  }

  public async removeFeaturedPost(eventID, postID) {
    const event = await this.byId(eventID);
    if (!event.featuredPosts.includes(OID(postID)))
      throw new Error("Post is not featured.");

    //Remove the post from the featuredPosts field of the event.
    await EventModel.updateOne(
      { _id: event._id },
      { $pull: { featuredPosts: OID(postID) } }
    );

    return event;
  }

  // Change the order of the subevents from the request body.
  public async changeSubEventOrder(eventID, subEvents) {
    const event = await this.byId(eventID);
    event.subEvents = subEvents;
    return event.save();
  }

  // Edit sponsor count and names.
  public async editSponsor(eventID, sponsors) {
    const event = await this.byId(eventID);
    event.sponsorCount = sponsors.length;
    event.sponsors = sponsors;
    return event.save();
  }

  // Add a user as permissioned user using member service.
  public async addPermissionedUser(eventID, userID, role) {
    const event = await this.byId(eventID);
    if (event.permissionedUsers.includes(OID(userID))) return event; //Already permissioned.

    //Add the user to the permissionedUsers field of the event.
    await EventModel.updateOne(
      { _id: event._id },
      { $push: { permissionedUsers: OID(userID) } }
    );

    return event;
  }

  // Remove a user from permissioned users.
  public async removePermissionedUser(eventID, userID) {
    const event = await this.byId(eventID);
    if (!event.permissionedUsers.includes(OID(userID)))
      throw new Error("User is not permissioned.");

    //Remove the user from the permissionedUsers field of the event.
    await EventModel.updateOne(
      { _id: event._id },
      { $pull: { permissionedUsers: OID(userID) } }
    );

    return event;
  }

  // List the permissioned users of the event.
  public async permissionedUsers(eventID) {
    return EventModel.findOne({ _id: OID(eventID) })
      .select("permissionedUsers")
      .populate({
        path: "permissionedUsers",
        select: ["username", "first_name", "last_name", "avatar_url"],
        options: {},
      })
      .exec();
  }

  // Edit partner count and names.
  public async editPartner(eventID, partners) {
    const event = await this.byId(eventID);
    event.partners = partners;
    return event.save();
  }
}
