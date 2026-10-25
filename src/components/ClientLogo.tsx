import type { Client } from "@/lib/site";

/** Client logo silhouette, ink at rest, gold on hover (CSS mask so one asset serves both). */
export function ClientLogo({ client, height = 64, className = "" }: { client: Client; height?: number; className?: string }) {
  const h = client.ratio > 1.6 ? height * 0.78 : height;
  return (
    <span
      role="img"
      aria-label={client.name}
      className={`logo-mask block ${className}`}
      style={{
        height: h,
        width: h * client.ratio,
        maskImage: `url(${client.mask})`,
        WebkitMaskImage: `url(${client.mask})`,
      }}
    />
  );
}
