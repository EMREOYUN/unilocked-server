import { DocumentType } from "@typegoose/typegoose";
import { Event } from "../../../../models/event";
import {
  EventAnalyticsModel,
  EventModel,
  EventTicketModel,
} from "../../../../resolved-models";

export async function eventViewAnalytics(event: DocumentType<Event>) {
  const olderEvents = await EventModel.find({
    organizator: event.organizator,
    _id: { $ne: event._id },
  })
    .sort({ createdAt: -1 })
    .limit(7);

  const olderEventsIds = olderEvents.map((event) => event._id);

  const olderEventsViews = await EventModel.aggregate([
    {
      $match: {
        _id: { $in: olderEventsIds },
      },
    },
    {
      $group: {
        _id: "$_id",
        views: { $sum: "$views" },
      },
    },
  ]);

  // get average views
  const totalViews = olderEventsViews.reduce(
    (acc, curr) => acc + curr.views,
    0
  );
  const averageViews = totalViews / olderEventsViews.length;

  const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const currentViews = await EventAnalyticsModel.aggregate([
    {
      $match: {
        event: event._id,
        createdAt: { $gt: lastMonth },
      },
    },
    {
      $group: {
        _id: "$event",
        views: { $sum: "$views" },
      },
    },
  ]);

  const currentViewsCount = currentViews[0]?.views || 0;

  const viewsDifference = currentViewsCount - averageViews;

  const viewsDifferencePercentage = viewsDifference / averageViews;

  const viewsDifferencePercentageRounded = Math.round(
    viewsDifferencePercentage * 100
  );

  const viewsDifferencePercentageRoundedString =
    viewsDifferencePercentageRounded.toString();

  const viewsDifferencePercentageString =
    viewsDifferencePercentageRoundedString[0] === "-"
      ? viewsDifferencePercentageRoundedString
      : "+" + viewsDifferencePercentageRoundedString;

  return {
    viewsDifferencePercentage: viewsDifferencePercentageString,
    viewsDifference: viewsDifference,
    averageViews: averageViews,
    currentViews: currentViewsCount,
  };
}

export async function eventApplicationAnalytics(
  event: DocumentType<Event>
) {
  const olderEvents = await EventModel.find({
    organizator: event.organizator,
    _id: { $ne: event._id },
  })
    .sort({ createdAt: -1 })
    .limit(7);

  const olderEventsIds = olderEvents.map((event) => event._id);

  const olderEventsTickets = await EventTicketModel.aggregate([
    {
      $match: {
        event: { $in: olderEventsIds },
      },
    },
    {
      $group: {
        _id: "$event",
        tickets: { $sum: "$tickets" },
      },
    },
  ]);

  const olderEventsTicketsCount = olderEventsTickets.reduce(
    (acc, curr) => acc + curr.tickets,
    0
  );

  const olderEventsTicketsAverage =
    olderEventsTicketsCount / olderEventsTickets.length;

  const currentTickets = await EventTicketModel.aggregate([
    {
      $match: {
        event: event._id,
      },
    },
    {
      $group: {
        _id: "$event",
        tickets: { $sum: "$tickets" },
      },
    },
  ]);

  const currentTicketsCount = currentTickets[0]?.tickets || 0;

  const ticketsDifference = currentTicketsCount - olderEventsTicketsAverage;

  const ticketsDifferencePercentage =
    ticketsDifference / olderEventsTicketsAverage;

  const ticketsDifferencePercentageRounded = Math.round(
    ticketsDifferencePercentage * 100
  );

  const ticketsDifferencePercentageString =
    ticketsDifferencePercentageRounded.toString();

  const ticketsDifferenceString =
    ticketsDifferencePercentageString[0] === "-"
      ? ticketsDifferencePercentageString
      : "+" + ticketsDifferencePercentageString;

  return {
    ticketsDifferencePercentage: ticketsDifferenceString,
    ticketsDifference: ticketsDifference,
    averageTickets: olderEventsTicketsAverage,
    currentTickets: currentTicketsCount,
  };
}
