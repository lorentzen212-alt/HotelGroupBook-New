import { useEffect, useRef, useState } from "react";

/**
 * Smooth liquid cursor hover effect.
 * A soft gold blob follows the pointer inside the element with springy
 * lag, plus two slower trailing blobs that create a gooey "liquid" wake.
 */
export function LiquidCursorHover({
  children,
  className,
  color = "226,180,115",
  radius = 999,
  as: Tag = "span",
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
  radius?: number;
  as?: "span" | "div";
} & React.HTMLAttributes<HTMLElement>) {
  const hostRef = useRef<HTMLElement | null>(null);
  const blobRefs = [
    useRef<HTMLSpanElement | null>(null),
    useRef<HTMLSpanElement | null>(null),
    useRef<HTMLSpanElement | null>(null),
  ];
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const ease = [0.22, 0.13, 0.08];
    const tick = () => {
      pos.current.forEach((p, i) => {
        p.x += (target.current.x - p.x) * ease[i]!;
        p.y += (target.current.y - p.y) * ease[i]!;
        const el = blobRefs[i]!.current;
        if (el) el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%)`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  const onEnter = (e: React.MouseEvent) => {
    const r = hostRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    target.current = { x, y };
    pos.current.forEach((p) => {
      p.x = x;
      p.y = y;
    });
    setActive(true);
  };

  const onMove = (e: React.MouseEvent) => {
    const r = hostRef.current?.getBoundingClientRect();
    if (!r) return;
    target.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const sizes = [86, 62, 44];
  const opacities = [0.5, 0.36, 0.28];

  return (
    <Tag
      ref={hostRef as never}
      className={className}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={() => setActive(false)}
      style={{ position: "relative", overflow: "hidden", borderRadius: radius, ...(rest.style ?? {}) }}
      {...rest}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{ opacity: active ? 1 : 0, mixBlendMode: "screen", filter: "blur(10px)" }}
      >
        {sizes.map((s, i) => (
          <span
            key={i}
            ref={blobRefs[i]}
            className="absolute left-0 top-0 rounded-full"
            style={{
              width: s,
              height: s,
              background: `radial-gradient(circle at 50% 50%, rgba(${color},${opacities[i]}) 0%, rgba(${color},${opacities[i]! * 0.45}) 45%, rgba(${color},0) 72%)`,
            }}
          />
        ))}
      </span>
      <span className="relative z-[1] contents">{children}</span>
    </Tag>
  );
}
