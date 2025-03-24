import * as moment from 'moment';

export async function calculateNextExecDate(date: Date, frequency: "daily" | "weekly" | "monthly" | "yearly"): Promise<Date> {
    switch (frequency) {
      case "daily":
        return moment(date).add(1, "days").toDate();
      case "weekly":
        return moment(date).add(1, "weeks").toDate();
      case "monthly":
        return moment(date).add(1, "months").toDate();
      case "yearly":
        return moment(date).add(1, "years").toDate();
      default:
        throw new Error("Invalid frequency type");
    }
}