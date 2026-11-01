import mongoose, { Schema, Document, Model } from "mongoose";

export type ShortlistStatus = "Shortlisted" | "Waitlisted";
export const SHORTLIST_STATUSES: ShortlistStatus[] = ["Shortlisted", "Waitlisted"];

export interface IShortlistedTeam extends Document {
  teamName: string;
  institution: string;
  city?: string;
  track?: string;
  leader?: string;
  status: ShortlistStatus;
  /** only published teams appear on the public /shortlisted page */
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ShortlistedTeamSchema: Schema<IShortlistedTeam> = new Schema(
  {
    teamName: { type: String, required: [true, "Team name is required"], trim: true },
    institution: { type: String, required: [true, "Institution is required"], trim: true },
    city: { type: String, trim: true, default: "" },
    track: { type: String, trim: true, default: "" },
    leader: { type: String, trim: true, default: "" },
    status: { type: String, enum: SHORTLIST_STATUSES, default: "Shortlisted" },
    published: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Prevent re-compilation of model in Next.js development
const ShortlistedTeam: Model<IShortlistedTeam> =
  mongoose.models.ShortlistedTeam || mongoose.model<IShortlistedTeam>("ShortlistedTeam", ShortlistedTeamSchema);

export default ShortlistedTeam;
