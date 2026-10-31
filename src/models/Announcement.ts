import mongoose, { Schema, Document, Model } from "mongoose";

export type Category = "General" | "Deadline" | "Results" | "Venue" | "Sponsors";

export interface IAnnouncement extends Document {
  category: Category;
  date: string;
  title: string;
  copy: string;
  action?: string;
  href?: string;
  featured: boolean;
  closed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema: Schema<IAnnouncement> = new Schema(
  {
    category: {
      type: String,
      enum: ["General", "Deadline", "Results", "Venue", "Sponsors"],
      required: [true, "Category is required"],
      default: "General",
    },
    date: {
      type: String,
      required: [true, "Date display text is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    copy: {
      type: String,
      required: [true, "Copy text is required"],
      trim: true,
    },
    action: {
      type: String,
      trim: true,
      default: "",
    },
    href: {
      type: String,
      trim: true,
      default: "",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    closed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation of model in Next.js development
const Announcement: Model<IAnnouncement> =
  mongoose.models.Announcement ||
  mongoose.model<IAnnouncement>("Announcement", AnnouncementSchema);

export default Announcement;
