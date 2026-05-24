import { AnnouncementFormData } from "../schemas/announcement";

export type Announcement = AnnouncementFormData & {
  id: number;
};
