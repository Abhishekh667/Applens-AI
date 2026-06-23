"use client";

import * as React from "react";
import { ImageIcon } from "lucide-react";

function toProxy(url: string): string {
  return `/api/image-proxy?url=${encodeURIComponent(
    url.replace(/^http:\/\//i, "https://"),
  )}`;
}

export function SafeImage({
  src,
  alt,
  className = "",
  icon,
  contain,
  fill = true,
}: {
  src?: string;
  alt: string;
  className?: string;
  icon?: boolean;
  contain?: boolean;
  fill?: boolean;
}) {
  const [state, setState] = React.useState<"loading" | "loaded" | "error">(
    "loading",
  );
  const [imgSrc, setImgSrc] = React.useState<string>("");

  const httpsSrc = React.useMemo(
    () => src?.replace(/^http:\/\//i, "https://") ?? "",
    [src],
  );
  const proxyUrl = React.useMemo(
    () => (httpsSrc ? toProxy(httpsSrc) : ""),
    [httpsSrc],
  );

  React.useEffect(() => {
    setImgSrc(proxyUrl);
    setState("loading");
  }, [proxyUrl]);

  const objectFit = contain || icon ? "contain" : "cover";

  if (!imgSrc) {
    return <Placeholder icon={icon} className={className} />;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt={alt}
        referrerPolicy="no-referrer"
        className={`transition-opacity duration-200 ${
          state === "loaded" ? "opacity-100" : "opacity-0"
        } ${fill ? "h-full w-full" : "w-full"}`}
        style={{ objectFit: fill ? objectFit : "contain" }}
        onLoad={() => setState("loaded")}
        onError={() => {
          if (imgSrc === proxyUrl && httpsSrc) {
            setImgSrc(httpsSrc);
          } else {
            setState("error");
          }
        }}
      />
      {state === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#F3F2EE]">
          <div className="h-5 w-5 animate-pulse rounded-full bg-black/10" />
        </div>
      )}
      {state === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#F3F2EE]">
          <Placeholder icon={icon} className="h-full w-full" />
        </div>
      )}
    </div>
  );
}

function Placeholder({
  icon,
  className,
}: {
  icon?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center bg-[#F3F2EE] ${className}`}
    >
      <ImageIcon className="h-5 w-5 text-foreground/20" />
    </div>
  );
}
