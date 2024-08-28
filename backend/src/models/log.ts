import mongoose from "mongoose";
/*
export type itemType = {
    userId: string;
    itemName: String;
    itemCals: number;
}
*/
export type logType = {
    _id: string;
    goalCal: number;
    currCal: number;
    logItems: { name: string; calories: number }[];
    logDate: string;
    journalEntry: string;
    weight: number;
    userId: string;
};
/*
const itemSchema = new mongoose.Schema<itemType>({
    userId: { type: String, required: true },
    itemName: { type: String, required: true },
    itemCals:{ type: Number, required: true },
});
*/

const calLogSchema = new mongoose.Schema<logType>({
  logItems: [{
    name: { type: String, required: true },
    calories: { type: Number, required: true }
  }],
  goalCal: { type: Number, required: false },
  currCal: { type: Number, required: false },
  weight: { type: Number, required: false },
  logDate: { type: String, required: true },
  journalEntry: { type: String, required: false },
  userId: { type: String, required: true },
});

const Log = mongoose.model<logType>("Log", calLogSchema);
export default Log;