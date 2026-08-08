import { createFileRoute, Link } from "@tanstack/react-router";
import { LiquidCursorHover } from "@/components/LiquidCursorHover";


import {
  ArrowRight,
  Users,
  Briefcase,
  ShieldCheck,
  Clock,
  Headphones,
  Lock,
  FileText,
  Building2,
  CheckCircle2,
  MapPin,
  Gem,
  Linkedin,
  Facebook,
  Instagram,
} from "lucide-react";
import {
  ShieldCheckPremium,
  ClockPremium,
  HeadsetPremium,
  LockPremium,
  GroupPremium,
} from "@/components/PremiumIcons";
import heroPoster from "@/assets/hero-fjord-boat.png";
import heroVideo from "@/assets/hero-video.mp4";
import cardMeetings from "@/assets/card-meetings-boardroom.png";
import cardManage from "@/assets/card-manage-concierge.png";
import logoImg from "@/assets/hotelgroupbook-logo.png";

import lofotenImg from "@/assets/dest-lofoten.jpg";
import tromsoImg from "@/assets/dest-tromso.jpg";
import bergenImg from "@/assets/dest-bergen.jpg";
import geirangerImg from "@/assets/dest-geiranger.jpg";
import stockholmImg from "@/assets/dest-stockholm.jpg";
import copenhagenImg from "@/assets/dest-copenhagen.jpg";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "HotelGroupBook — Group Hotel Bookings in Scandinavia" },
      {
        name: "description",
        content:
          "One request, multiple hotel offers. Book leisure groups, meetings and events across Scandinavia with expert support and no commitment.",
      },
      { property: "og:title", content: "HotelGroupBook — Group Hotel Bookings in Scandinavia" },
      {
        property: "og:description",
        content:
          "One request, multiple hotel offers. Book leisure groups, meetings and events across Scandinavia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

import { SiteMenu, type SiteMenuItem } from "@/components/SiteMenu";

const MENU_ITEMS: SiteMenuItem[] = [
  { label: "Book Leisure", to: "/book-leisure" },
  { label: "Book Meetings & Events", to: "/book-meetings-events" },
  { label: "Manage Bookings", to: "/manage-bookings" },
  { label: "About Us", href: "#about" },
  { label: "How It Works", href: "#how" },
  { label: "Become a Partner", href: "#partner" },
  { label: "Support", href: "#support" },
  { label: "Contact", href: "#contact" },
];


const TRUST = [
  { Icon: ShieldCheckPremium, label: "No commitment", size: 37 },
  { Icon: ClockPremium, label: "Fast and free", size: 37 },
  { Icon: HeadsetPremium, label: "Expert support", size: 41 },
  { Icon: LockPremium, label: "Secure & trusted", size: 37 },
];

function GoldLineWithDiamond({
  className,
  lineWidth = "w-[260px] sm:w-[300px] lg:w-[330px]",
  lineThickness = "h-[2px]",
  diamondSize = "h-[5px] w-[5px]",
}: {
  className?: string;
  lineWidth?: string;
  lineThickness?: string;
  diamondSize?: string;
}) {
  return (
    <div className={cn("flex items-center", className)}>
      <div className={cn("bg-[#C3B8A4]", lineThickness, lineWidth)} />
      <div className={cn("ml-0.5 rotate-45 bg-[#C3B8A4]", diamondSize)} />
    </div>
  );
}


const HERO_LINKS = [
  { label: "Book Leisure", to: "/book-leisure" },
  { label: "Meetings & Events", to: "/book-meetings-events" },
  { label: "Manage Bookings", to: "/manage-bookings" },
] as const;

const CARD_HEIGHT = "clamp(300px, 52vh, 540px)";

function Home() {
  return (
    <>
      <main className="relative w-full bg-[#0A0B0D]">
        {/* ---------------------------- HERO ---------------------------- */}
        <section className="relative h-screen min-h-[620px] w-full overflow-hidden lg:h-[calc(100vh-300px)] lg:min-h-[390px]">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={heroPoster}
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "center center" }}
          >
            <source src={heroVideo} type="video/mp4" />
          </video>

          {/* Cinematic overlay — soft navy gradient + gentle vignette */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(8,17,28,0.52) 0%, rgba(10,20,32,0.16) 34%, rgba(9,18,29,0.20) 62%, rgba(7,14,23,0.62) 100%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 50% 45%, rgba(0,0,0,0) 42%, rgba(4,10,17,0.34) 82%, rgba(3,8,14,0.52) 100%)",
            }}
          />

          {/* HEADER */}
          <header className="absolute inset-x-0 top-0 z-30 flex h-[100px] sm:h-[120px] lg:h-[140px] items-center justify-between px-5 sm:px-8 lg:px-[50px] xl:px-[60px]">
            <a
              href="/"
              aria-label="HotelGroupBook"
              className="logo-hover-wrap relative flex items-center rounded-lg bg-[#0A0B0D]/40 px-2 py-0.5 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
            >
              <span className="logo-mist" aria-hidden="true" />
              <img
                src={logoImg}
                alt="HotelGroupBook"
                className="relative h-[80px] sm:h-[100px] lg:h-[120px] w-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
              />
            </a>
            <SiteMenu items={MENU_ITEMS} variant="outline" />
          </header>

          {/* HERO CONTENT — vertically centred */}
          <div className="relative z-20 flex h-full flex-col items-center justify-center px-5 text-center sm:px-8 lg:pt-[25px]">
            <span
              className="text-[11px] uppercase tracking-[0.42em]"
              style={{ color: "#E5A93C", fontWeight: 600 }}
            >
              The Experience
            </span>

            <h1
              className="mx-auto mt-5 max-w-[1000px] text-white text-[38px] leading-[1.1] sm:text-[56px] lg:text-[clamp(52px,5.2vw,80px)]"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontWeight: 300,
                letterSpacing: "0.015em",
                textShadow: "0 2px 30px rgba(4,10,18,0.45)",
              }}
            >
              <span className="block">Group travel,</span>
              <span className="block">
                <em className="italic" style={{ fontWeight: 400 }}>
                  beautifully
                </em>{" "}
                arranged
              </span>
            </h1>

            <p
              className="mx-auto mt-6 max-w-[620px] text-[15px] font-light leading-[1.7] tracking-[0.015em] text-white/85 lg:text-[17px]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              One refined platform for leisure groups, meetings, events and hotel
              booking management across the Nordics.
            </p>

            {/* Three premium text links with metallic gold dividers */}
            <nav className="mt-10 flex flex-wrap items-center justify-center gap-y-4">
              {HERO_LINKS.map((link, i) => (
                <div key={link.to} className="flex items-center">
                  {i > 0 && (
                    <span
                      aria-hidden
                      className="mx-6 hidden h-[26px] w-px sm:mx-9 sm:inline-block"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(226,190,122,0) 0%, rgba(238,206,140,0.78) 50%, rgba(226,190,122,0) 100%)",
                      }}
                    />
                  )}
                  <Link
                    to={link.to}
                    className="group/link relative px-3 text-[12.5px] uppercase tracking-[0.24em] text-white/92 transition-colors duration-300 hover:text-white lg:text-[13.5px]"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                  >
                    {link.label}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -bottom-[7px] left-3 right-3 h-px origin-left scale-x-0 transition-transform duration-[420ms] ease-out group-hover/link:scale-x-100"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(226,190,122,0) 0%, rgba(240,213,138,0.95) 50%, rgba(226,190,122,0) 100%)",
                      }}
                    />
                  </Link>
                </div>
              ))}
            </nav>

            {/* Explore indicator */}
            <a href="#how" className="group/explore mt-16 block" aria-label="Explore">
              <LiquidCursorHover
                as="div"
                radius={20}
                className="flex flex-col items-center gap-3 px-7 py-4"
              >
                <span
                  className="flex h-[38px] w-[38px] items-center justify-center rounded-full transition-transform duration-500 group-hover/explore:translate-y-1"
                  style={{ border: "1px solid rgba(226,190,122,0.55)" }}
                >
                  <span className="text-[15px] leading-none" style={{ color: "#E2B473" }}>
                    ↓
                  </span>
                </span>
                <span
                  className="text-[10.5px] uppercase tracking-[0.34em]"
                  style={{ color: "rgba(226,180,115,0.9)", fontFamily: "Inter, sans-serif" }}
                >
                  Explore
                </span>
              </LiquidCursorHover>
            </a>

          </div>
        </section>
      </main>

      {/* ===== Framed light section: entrance cards + How It Works =====
           Two 8px #0D1621 architectural side panels run flush from the
           bottom edge of the hero to the top edge of Popular Group
           Destinations, framing the cream content between them. */}
      <div
        className="relative"
        style={{
          background:
            "radial-gradient(125% 95% at 50% 24%, #F8F6F2 0%, #F6F3ED 32%, #F2EEE7 58%, #EDE9E2 80%, #ECE8E1 100%)",
        }}
      >
        {/* ------------------- ENTRANCE CARDS (overlap hero) ------------------- */}
        <section className="relative pb-16 lg:pb-20 lg:pt-[32px]">
          <div
            className="hero-cards-offset relative z-20 mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-[60px]"
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-[38px]">
              <ExperienceCard
                to="/book-leisure"
                image={heroPoster}
                imagePosition="center 46%"
                label="L E I S U R E"
                tagline="Group Hotel Booking"
                ctaText="Explore"
                intensity={1.8}
                refined
                disableCoolGrey
                imageFilter="brightness(1.02) contrast(1.06) saturate(0.94)"
                overlay="from-transparent via-transparent via-[80%] to-black/10"
              />
              <ExperienceCard
                to="/book-meetings-events"
                image={cardMeetings}
                imagePosition="center 42%"
                label="M & E"
                tagline="Professional Event Planning"
                ctaText="Plan event"
                intensity={1.8}
                refined
                disableCoolGrey
                imageFilter="brightness(1.34) contrast(1.05) saturate(0.92)"
                overlay="from-transparent via-transparent via-[80%] to-black/10"
              />

              <ExperienceCard
                to="/manage-bookings"
                image={cardManage}
                imagePosition="center 45%"
                label="M A N A G E"
                tagline="Manage Your Bookings"
                ctaText="Open dashboard"
                intensity={1.8}
                refined
                disableCoolGrey
                imageFilter="brightness(1.34) contrast(1.05) saturate(0.92)"
                overlay="from-transparent via-transparent via-[80%] to-black/10"
              />

            </div>

            {/* Quiet editorial promise line */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-y-3">
              {["One Request", "One Team", "One Contact", "Total Simplicity"].map((item, i) => (
                <div key={item} className="flex items-center">
                  {i > 0 && (
                    <span
                      aria-hidden
                      className="mx-5 h-[14px] w-px sm:mx-8"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(176,140,72,0) 0%, rgba(176,140,72,0.6) 50%, rgba(176,140,72,0) 100%)",
                      }}
                    />
                  )}
                  <span
                    className="whitespace-nowrap text-[12px] uppercase tracking-[0.22em] text-[#3B4A56]"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <HowItWorks />

        {/* Architectural side panels — flush from hero bottom to Destinations top */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 top-0 w-[13px]"
          style={{ backgroundColor: "#0D1621" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 top-0 w-[13px]"
          style={{ backgroundColor: "#0D1621" }}
        />
      </div>

      <Destinations />
      <WhyChoose />
      <FinalCTA />
      <SiteFooter />
    </>
  );
}

function ExperienceCard({
  to,
  image,
  imagePosition = "center center",
  imageFilter = "brightness(1.075) contrast(1.12) saturate(0.87) hue-rotate(-6deg) sepia(0.05)",
  overlay = "from-transparent via-transparent via-[86%] to-black/12",
  bottomGradient = true,
  borderGradient,
  disableCoolGrey = false,
  refined = false,

  label,
  tagline,
  ctaText,
  intensity = 1,
}: {
  to: string;
  image: string;
  imagePosition?: string;
  imageFilter?: string;
  overlay?: string;
  bottomGradient?: boolean;
  borderGradient?: string;
  disableCoolGrey?: boolean;
  refined?: boolean;
  label: string;
  tagline: React.ReactNode;
  ctaText: string;
  intensity?: number;
}) {
  
  const k = Math.min(intensity, 2.2);
  const clamp = (v: number) => Math.min(v, 1);


  return (
    <div
      className="relative"
      style={{ isolation: "isolate", overflow: "visible" }}
    >
      {/* Extremely soft radial glow behind the card */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-[14%] -inset-y-[10%] -z-10"
        style={{
          background:
            "radial-gradient(52% 48% at 50% 50%, rgba(255,247,230,0.07) 0%, rgba(255,244,222,0.035) 45%, rgba(0,0,0,0) 78%)",
          filter: "blur(18px)",
        }}
      />

      {/* Inner warm haze — pulled in tight, no side spill */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          left: "50%",
          bottom: "-2px",
          transform: "translateX(-50%)",
          width: "86%",
          height: "10px",
          borderRadius: "45%",
          background:
            `radial-gradient(ellipse at center, rgba(255, 254, 250, ${clamp(0.92 * k)}) 0%, rgba(255, 245, 220, ${clamp(0.68 * k)}) 45%, rgba(250, 220, 160, ${clamp(0.3 * k)}) 72%, transparent 92%)`,
          filter: "blur(4px)",
          opacity: 1,
          zIndex: 0,
        }}
      />
      {/* Bright warm-white bloom pressed to card base */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          left: "50%",
          bottom: "0px",
          transform: "translateX(-50%)",
          width: "88%",
          height: "6px",
          borderRadius: "45%",
          background:
            `radial-gradient(ellipse at center, rgba(255, 254, 248, ${clamp(1 * k)}) 0%, rgba(255, 248, 225, ${clamp(0.96 * k)}) 40%, rgba(255, 235, 190, ${clamp(0.58 * k)}) 72%, transparent 92%)`,
          filter: "blur(2px)",
          opacity: 1,
          zIndex: 1,
        }}
      />
      {/* Strong white light bar along bottom edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          left: "50%",
          bottom: "0px",
          transform: "translateX(-50%)",
          width: "90%",
          height: "3px",
          borderRadius: "6px",
          background:
            `linear-gradient(to right, transparent 0%, rgba(255, 255, 252, ${clamp(1 * k)}) 12%, rgba(255, 254, 245, ${clamp(1 * k)}) 50%, rgba(255, 255, 252, ${clamp(1 * k)}) 88%, transparent 100%)`,
          filter: "blur(0.6px)",
          opacity: 1,
          zIndex: 1,
        }}
      />
      {/* Hot white contact streak — the light source itself */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          left: "50%",
          bottom: "1px",
          transform: "translateX(-50%)",
          width: "92%",
          height: "1.5px",
          borderRadius: "2px",
          background:
            `linear-gradient(to right, transparent 0%, rgba(255, 255, 255, ${clamp(1 * k)}) 10%, rgba(255, 255, 255, ${clamp(1 * k)}) 50%, rgba(255, 255, 255, ${clamp(1 * k)}) 90%, transparent 100%)`,
          filter: "blur(0.2px)",
          zIndex: 2,
        }}
      />





      <Link
        to={to}
        className="group/card relative block overflow-hidden rounded-[22px] bg-[#0E1013] group"
        style={{
          position: "relative",
          zIndex: 2,
          border: refined
            ? "1px solid rgba(184, 138, 46, 0.34)"
            : "1px solid rgba(184, 138, 46, 0.55)",
          boxShadow: refined
            ? "0 10px 28px rgba(5,10,16,0.34), 0 26px 66px rgba(5,10,16,0.28), inset 0 1px 0 rgba(255,255,255,0.07)"
            : "0 14px 35px rgba(0,0,0,0.48), 0 34px 84px rgba(0,0,0,0.40), 0 0 18px rgba(212,175,85,0.10), 0 3px 8px rgba(224,185,90,0.12), inset 0 1px 0 rgba(255,255,255,0.10)",

          transition:
            "transform 420ms cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 420ms cubic-bezier(0.22, 0.61, 0.36, 1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-10px)";
          e.currentTarget.style.boxShadow = refined
            ? "0 16px 38px rgba(5,10,16,0.38), 0 34px 88px rgba(5,10,16,0.32), inset 0 1px 0 rgba(255,255,255,0.10)"
            : "0 22px 48px rgba(0,0,0,0.50), 0 46px 110px rgba(0,0,0,0.46), 0 0 26px rgba(212,175,85,0.16), inset 0 1px 0 rgba(255,255,255,0.14)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = refined
            ? "0 10px 28px rgba(5,10,16,0.34), 0 26px 66px rgba(5,10,16,0.28), inset 0 1px 0 rgba(255,255,255,0.07)"
            : "0 14px 35px rgba(0,0,0,0.48), 0 34px 84px rgba(0,0,0,0.40), 0 0 18px rgba(212,175,85,0.10), 0 3px 8px rgba(224,185,90,0.12), inset 0 1px 0 rgba(255,255,255,0.10)";
        }}

      >
        {/* Brushed champagne-gold ring */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 z-20 rounded-[22px] transition-opacity duration-300 group-hover:opacity-100",
            refined ? "opacity-60" : "opacity-90",
          )}
          style={{
            padding: refined ? "0.5px" : "1px",
            background:
              borderGradient ||
              "linear-gradient(155deg, #F0D58A 0%, #D4AF55 12%, #B98A2E 30%, #8F681C 46%, #C09235 62%, #765116 78%, #D4AF55 92%, #F0D58A 100%)",

            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
        {/* Soft gold reflection on border during hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 rounded-[22px] opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
          style={{
            padding: "1px",
            background:
              "linear-gradient(145deg, rgba(255,250,235,0.55) 0%, rgba(232,212,167,0.22) 30%, rgba(150,120,72,0.08) 55%, rgba(246,231,196,0.42) 100%)",
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
        {/* Full-height background image */}
        <div
          className="relative w-full aspect-[12/13.6] overflow-hidden"
          style={{ height: "clamp(300px, 52vh, 540px)", maxHeight: "none" }}

        >
          <img
            src={image}
            alt=""
            style={{ objectPosition: imagePosition, filter: imageFilter }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Unified cinematic grade: cool grey cast + champagne highlights */}
          {!disableCoolGrey && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 mix-blend-soft-light"
              style={{
                background:
                  "linear-gradient(180deg, rgba(150,168,186,0.30) 0%, rgba(120,136,154,0.18) 48%, rgba(38,44,52,0.34) 100%)",
              }}
            />
          )}
          {/* Champagne highlight tint */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-overlay"
            style={{
              background:
                "radial-gradient(120% 80% at 50% 22%, rgba(226,206,166,0.16) 0%, rgba(226,206,166,0) 62%)",
            }}
          />
          {/* Lifted charcoal blacks + subtle cinematic haze */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(216,224,232,0.045) 0%, rgba(30,36,44,0.06) 100%)",
            }}
          />

          {/* Cinematic gradient: lighter top, progressively darker bottom */}
          <div className={cn("absolute inset-0 bg-gradient-to-b", overlay)} />
          {/* Subtle bottom gradient purely for text legibility */}
          {bottomGradient && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10"
              style={{
                background: refined
                  ? "linear-gradient(to top, rgba(2,6,11,0.72) 0%, rgba(2,6,11,0.46) 16%, rgba(2,6,11,0.20) 28%, rgba(2,6,11,0.06) 36%, transparent 42%)"
                  : "linear-gradient(to top, rgba(4,8,13,0.60) 0%, rgba(4,8,13,0.20) 30%, transparent 54%)",
              }}
            />
          )}

          {/* Content overlay — quiet editorial typography block */}
          <div className="absolute inset-0 z-20">
            <div
              className="absolute text-left"
              style={{ left: "41px", bottom: refined ? "84px" : "76px" }}
            >
              <p
                className="uppercase"
                style={{
                  color: "#FFFFFF",
                  fontSize: refined ? "21px" : "17.46px",
                  fontWeight: refined ? 500 : 600,
                  letterSpacing: refined ? "0.34em" : "0.28em",
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                  textShadow: refined ? "0 2px 18px rgba(2,6,11,0.45)" : undefined,
                }}
              >
                {label}
              </p>
              <p
                style={{
                  marginTop: refined ? "12px" : "7px",
                  color: refined ? "rgba(255,255,255,0.74)" : "rgba(255,255,255,0.8)",
                  fontSize: refined ? "13.5px" : "14.55px",
                  fontWeight: refined ? 300 : 400,
                  letterSpacing: refined ? "0.045em" : undefined,
                  lineHeight: 1.5,
                  whiteSpace: "nowrap",
                  textShadow: refined ? "0 1px 14px rgba(2,6,11,0.4)" : undefined,
                }}
              >
                {tagline}
              </p>
            </div>
            <span
              className="absolute flex items-center opacity-[0.9] transition-opacity duration-[250ms] ease-out group-hover/card:opacity-100"
              style={{
                left: "41px",
                bottom: refined ? "30px" : "26px",
                color: "#FFFFFF",
                fontSize: refined ? "13px" : "14.55px",
                fontWeight: refined ? 400 : 500,
                letterSpacing: refined ? "0.09em" : undefined,
                whiteSpace: "nowrap",
                textShadow: refined ? "0 1px 14px rgba(2,6,11,0.4)" : undefined,
              }}
            >
              {ctaText}
              <span className="ml-[10px] inline-block transition-transform duration-[250ms] ease-out group-hover/card:translate-x-1">
                →
              </span>
            </span>
          </div>



        </div>
      </Link>
    </div>
  );
}





function CTAButton({
  icon,
  label,
  variant,
  to,
}: {
  icon: React.ReactNode;
  label: React.ReactNode;
  variant: "light" | "dark" | "deep";
  to?: string;
}) {
  const light = variant === "light";
  const deep = variant === "deep";
  const className = cn(
    "group flex items-center justify-between pl-6 pr-[22px] border transition-all duration-200 ease-out hover:translate-y-[-2px]",
    to && "cursor-pointer",
    light
      ? "bg-white border-white text-[#071A2B] shadow-[0_8px_24px_rgba(0,0,0,0.16)] hover:bg-[#FFFEFC] hover:border-[#FFFEFC] hover:shadow-[0_14px_34px_rgba(0,0,0,0.18),0_0_28px_rgba(255,196,0,0.18),0_0_56px_rgba(255,196,0,0.08)]"
      : deep
        ? "bg-[#0A1426] border-[rgba(255,255,255,0.16)] text-white shadow-[0_8px_24px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.06)] hover:bg-[#0F1E33] hover:border-white/25 hover:shadow-[0_12px_30px_rgba(0,0,0,0.24),0_0_22px_rgba(255,196,0,0.12),inset_0_1px_0_rgba(255,255,255,0.08)]"
        : "bg-[#0D1F33] border-[rgba(255,255,255,0.16)] text-white shadow-[0_8px_24px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.06)] hover:bg-[#122840] hover:border-white/25 hover:shadow-[0_12px_30px_rgba(0,0,0,0.24),0_0_22px_rgba(255,196,0,0.12),inset_0_1px_0_rgba(255,255,255,0.08)]"
  );
  const style = { flex: "0 0 268px", height: 64, borderRadius: 6 } as const;
  const inner = (
    <>
      <span className="flex items-center" style={{ gap: 18 }}>
        <span className={cn("flex items-center shrink-0 transition-all duration-200 ease-out", light ? "text-[#FFC400] group-hover:text-[#FFD966] group-hover:drop-shadow-[0_0_6px_rgba(255,196,0,0.55)]" : "text-[#FFC400]")}>
          {icon}
        </span>
        <span className={cn("text-[17px] font-semibold leading-none", light ? "text-[#071A2B]" : "text-white")}>
          {label}
        </span>
      </span>
      <ArrowRight
        className={cn(
          "transition-transform duration-200 ease-out group-hover:translate-x-1 shrink-0",
          light ? "text-[#FFC400] group-hover:text-[#FFD966] group-hover:drop-shadow-[0_0_6px_rgba(255,196,0,0.55)]" : "text-[#FFC400]"
        )}
        size={24}
        strokeWidth={1.9}
      />
    </>
  );
  if (to) {
    return (
      <Link to={to} style={style} className={className}>
        {inner}
      </Link>
    );
  }
  return (
    <button style={style} className={className}>
      {inner}
    </button>
  );
}


/* --------------------------- HOW IT WORKS --------------------------- */

const STEPS = [
  {
    Icon: FileText,
    title: "Submit Your Request",
    desc: "Tell us where, when and how many guests you're planning for.",
  },
  {
    Icon: Building2,
    title: "Receive Hotel Offers",
    desc: "We send your request to multiple hotels that compete to offer their best rates.",
  },
  {
    Icon: CheckCircle2,
    title: "Book With Confidence",
    desc: "Compare offers, choose the best option and confirm in one place.",
  },
];

function SectionEyebrowDivider() {
  return (
    <div className="mx-auto mt-3 flex items-center justify-center">
      <div className="h-[2px] w-16 bg-[#FFC400]" />
      <div className="ml-3 h-[8px] w-[8px] rotate-45 bg-[#FFC400]" />
      <div className="ml-3 h-[2px] w-16 bg-[#FFC400]" />
    </div>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="pb-20 lg:pb-24 pt-2 lg:pt-6 px-5 sm:px-8 lg:px-[60px]">
      <div className="mx-auto max-w-6xl text-center">
        <h2
          className="text-[#04111A] text-3xl sm:text-4xl lg:text-[44px] font-normal"
          style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
        >
          How It Works
        </h2>
        <SectionEyebrowDivider />
        <p className="mt-5 text-[#3B4A56] text-base lg:text-lg">
          Simple. Fast. Built for groups.
        </p>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-6 relative">
          {STEPS.map(({ Icon, title, desc }, i) => (
            <div key={title} className="flex flex-col items-center px-4 relative">
              <div className="relative">
                <span className="absolute -top-2 -right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-[#FFC400] bg-[#F5F3EE] text-[#FFC400] text-sm font-semibold">
                  {i + 1}
                </span>
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#04111A] shadow-sm">
                  <Icon className="text-[#FFC400]" size={34} strokeWidth={1.75} />
                </div>
              </div>
              <h3 className="mt-6 text-[#04111A] text-xl font-semibold">{title}</h3>
              <p className="mt-3 max-w-xs text-[#3B4A56] text-[15px] leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- DESTINATIONS --------------------------- */

const DESTINATIONS = [
  { name: "Lofoten", country: "Norway", img: lofotenImg },
  { name: "Tromsø", country: "Norway", img: tromsoImg },
  { name: "Bergen", country: "Norway", img: bergenImg },
  { name: "Geiranger", country: "Norway", img: geirangerImg },
  { name: "Stockholm", country: "Sweden", img: stockholmImg },
  { name: "Copenhagen", country: "Denmark", img: copenhagenImg },
];

function Destinations() {
  return (
    <section className="bg-[#04111A] py-20 lg:py-24 px-5 sm:px-8 lg:px-[60px]">
      <div className="mx-auto max-w-7xl text-center">
        <h2
          className="text-white text-3xl sm:text-4xl lg:text-[44px] font-normal"
          style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
        >
          Popular Group Destinations
        </h2>
        <SectionEyebrowDivider />
        <p className="mt-5 text-[#C8CFD6] text-base lg:text-lg">
          Explore handpicked destinations perfect for your next group trip.
        </p>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-5">
          {DESTINATIONS.map((d) => (
            <a
              key={d.name}
              href="#"
              className="group relative block overflow-hidden rounded-xl aspect-[4/5] border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-[#FFC400]/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
            >
              <img
                src={d.img}
                alt={`${d.name}, ${d.country}`}
                width={800}
                height={1000}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                <p className="text-[11px] uppercase tracking-wider text-[#C8CFD6]">
                  {d.country}
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <MapPin className="text-[#FFC400]" size={14} strokeWidth={2.25} />
                  <p className="text-white text-base font-semibold">{d.name}</p>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-md border border-[#FFC400] px-7 py-3 text-white text-[15px] transition-colors hover:bg-[#FFC400]/10"
          >
            View All Destinations
            <ArrowRight size={18} className="text-[#FFC400]" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- WHY CHOOSE --------------------------- */

const REASONS = [
  {
    Icon: Gem,
    title: "Best Rates",
    desc: "Hotels compete for your group and offer their best possible rates.",
  },
  {
    Icon: Clock,
    title: "Save Time",
    desc: "One request instead of dozens of emails.",
  },
  {
    Icon: Headphones,
    title: "Expert Support",
    desc: "Personal service from experienced group booking professionals.",
  },
  {
    Icon: ShieldCheck,
    title: "Secure & Trusted",
    desc: "Your data is safe with us. No commitment.",
  },
];

function WhyChoose() {
  return (
    <section className="bg-[#F5F3EE] py-20 lg:py-24 px-5 sm:px-8 lg:px-[60px]">
      <div className="mx-auto max-w-6xl text-center">
        <h2
          className="text-[#04111A] text-3xl sm:text-4xl lg:text-[44px] font-normal"
          style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
        >
          Why Choose HotelGroupBook?
        </h2>
        <SectionEyebrowDivider />
        <p className="mt-5 text-[#3B4A56] text-base lg:text-lg">
          The smarter way to manage group hotel bookings.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {REASONS.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl bg-white p-7 text-left shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(4,17,26,0.05)] transition-transform hover:-translate-y-1"
            >
              <Icon className="text-[#F5AE00]" size={30} strokeWidth={1.75} />
              <h3 className="mt-4 text-[#04111A] text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-[#3B4A56] text-[14.5px] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- FINAL CTA --------------------------- */

function FinalCTA() {
  return (
    <section className="bg-[#04111A] py-20 lg:py-24 px-5 sm:px-8 lg:px-[60px]">
      <div className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-gradient-to-br from-[#0B2238] to-[#04111A] px-8 py-12 lg:px-14 lg:py-14 text-center shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
        <h2
          className="text-white text-3xl sm:text-4xl lg:text-[40px] font-normal leading-tight"
          style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
        >
          Ready to Receive Hotel Offers <span className="italic">for Your Group?</span>
        </h2>
        <p className="mt-4 text-[#C8CFD6] text-base lg:text-lg">
          Start your request today. It&apos;s free and without obligation.
        </p>

        <div className="mt-9 flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="#"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#F5AE00] px-7 py-3.5 text-[#04111A] text-[15px] font-semibold transition-all hover:-translate-y-0.5 hover:bg-[#FFC400] hover:shadow-[0_10px_30px_rgba(255,196,0,0.25)]"
          >
            Start a Leisure Request
            <ArrowRight size={18} />
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-white/30 px-7 py-3.5 text-white text-[15px] font-semibold transition-colors hover:bg-white/10 hover:border-[#FFC400]/60"
          >
            Request M&amp;E
            <ArrowRight size={18} className="text-[#FFC400]" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- FOOTER --------------------------- */

const FOOTER_COLS = [
  {
    heading: "Company",
    links: ["About Us", "Become a Partner", "How It Works", "Contact"],
  },
  {
    heading: "Destinations",
    links: ["Norway", "Sweden", "Denmark", "All Destinations"],
  },
  {
    heading: "Support",
    links: ["Help Center", "FAQ", "Terms of Use", "Privacy Policy"],
  },
];

function SiteFooter() {
  return (
    <footer className="bg-[#02101A] border-t border-white/5 px-5 sm:px-8 lg:px-[60px] pt-16 pb-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <a href="/" aria-label="HotelGroupBook" className="inline-flex items-center">
              <img src={logoImg} alt="HotelGroupBook" className="h-12 sm:h-14 lg:h-[60px] w-auto" />
            </a>

            <p className="mt-3 text-[#8A96A2] text-sm">
              Group hotel bookings made simple.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[Linkedin, Facebook, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-[#FFC400] hover:text-[#FFC400]"
                  aria-label="social"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLS.map((col) => (
            <div key={col.heading}>
              <h4 className="text-white text-sm font-semibold tracking-wide">
                {col.heading}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-[#8A96A2] text-sm transition-colors hover:text-[#FFC400]"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-white text-sm font-semibold tracking-wide">Newsletter</h4>
            <p className="mt-4 text-[#8A96A2] text-sm">
              Get tips and news for group travel straight to your inbox.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-4 flex items-center gap-2"
            >
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded-md border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-[#6B7683] outline-none focus:border-[#FFC400]/60"
              />
              <button
                type="submit"
                className="flex h-10 w-10 items-center justify-center rounded-md bg-[#F5AE00] text-[#04111A] transition-colors hover:bg-[#FFC400]"
                aria-label="Subscribe"
              >
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/5 pt-6">
          <p className="text-[#6B7683] text-xs">
            © {new Date().getFullYear()} HotelGroupBook. All rights reserved.
          </p>
          <p className="text-[#6B7683] text-xs">Built for group booking professionals.</p>
        </div>
      </div>
    </footer>
  );
}
