import { createFileRoute } from "@tanstack/react-router";
import { BookingWizard } from "@/components/BookingWizard";
import { SiteShell } from "@/components/SiteShell";

export const Route = createFileRoute("/book-meetings-events")({
  head: () => ({
    meta: [
      { title: "Meetings & Events Requests — HotelGroupBook" },
      {
        name: "description",
        content:
          "Request venues, meeting spaces and delegate rooms for your next conference in Scandinavia.",
      },
      { property: "og:title", content: "Meetings & Events Requests — HotelGroupBook" },
      {
        property: "og:description",
        content: "One request, multiple venue offers for meetings, conferences and events.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BookMeetingsPage,
});

function BookMeetingsPage() {
  return (
    <SiteShell>
      <BookingWizard
        bookingType="me"
        title="Meetings & events"
        intro="Share your delegate numbers and meeting needs. We'll bring back matching venues."
      />
    </SiteShell>
  );
}