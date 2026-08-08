import { createFileRoute } from "@tanstack/react-router";
import { BookingWizard } from "@/components/BookingWizard";
import { SiteShell } from "@/components/SiteShell";

export const Route = createFileRoute("/book-leisure")({
  head: () => ({
    meta: [
      { title: "Book Leisure Groups — HotelGroupBook" },
      {
        name: "description",
        content:
          "Send one leisure group request and receive matching hotel offers across Scandinavia.",
      },
      { property: "og:title", content: "Book Leisure Groups — HotelGroupBook" },
      {
        property: "og:description",
        content: "One request, multiple hotel offers for leisure groups in Scandinavia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BookLeisurePage,
});

function BookLeisurePage() {
  return (
    <SiteShell>
      <BookingWizard
        bookingType="leisure"
        title="Book a leisure group"
        intro="Tell us where you're going and how many rooms you need. We collect the offers — you choose."
      />
    </SiteShell>
  );
}