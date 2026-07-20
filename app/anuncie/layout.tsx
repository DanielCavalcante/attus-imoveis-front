import { AnnouncementFormProvider } from "./_context/announcement-form-context";

export default function AnuncieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AnnouncementFormProvider>{children}</AnnouncementFormProvider>;
}
