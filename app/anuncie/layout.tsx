import { AnnouncementFormProvider } from "./_context/announcement-form-context";

export default function AdvertiseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AnnouncementFormProvider>{children}</AnnouncementFormProvider>;
}
