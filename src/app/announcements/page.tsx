import Announcements from "@/components/announcements/Announcements";
import { connectToDatabase } from "@/lib/mongodb";
import Announcement from "@/models/Announcement";

export const metadata = { title: "Announcements | wHACKiest 2026" };

async function getAnnouncements() {
  "use cache";
  try {
    await connectToDatabase();
    const items = await Announcement.find({})
      .sort({ featured: -1, createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(items));
  } catch (err) {
    console.error("Error pre-fetching announcements on server:", err);
    return [];
  }
}

export default async function Page() {
  const initialAnnouncements = await getAnnouncements();
  return <Announcements initialAnnouncements={initialAnnouncements} />;
}

