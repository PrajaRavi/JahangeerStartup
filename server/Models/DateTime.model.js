import mongoose from "mongoose";

const DaySchema = new mongoose.Schema({
  Day: [{ type: String, default: "" }],

  
},{timestamps:true});
const TimeSchema = new mongoose.Schema({
  Time: [
    { from: { type: String, default: "" }, to: { type: String, default: "" } },
  ],
  
},{timestamps:true});
export const TimeSettModel= mongoose.model("TimeSett", TimeSchema);
export const  DaySettModel= mongoose.model("DaySett", DaySchema);
