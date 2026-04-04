"use client";

import { useEffect, useId, useRef } from "react";

const TENOR_SCRIPT_ID = "tenor-embed-script";
const TENOR_SCRIPT_SRC = "https://tenor.com/embed.js";

export function TenorEmbed() {
  const embedRef = useRef<HTMLDivElement | null>(null);
  const fallbackId = useId();

  useEffect(() => {
    const container = embedRef.current;

    if (!container) {
      return;
    }

    const currentScript = document.getElementById(TENOR_SCRIPT_ID);
    const nextScript = document.createElement("script");

    nextScript.id = TENOR_SCRIPT_ID;
    nextScript.src = TENOR_SCRIPT_SRC;
    nextScript.async = true;

    if (currentScript?.parentNode) {
      currentScript.parentNode.replaceChild(nextScript, currentScript);
    } else {
      document.body.appendChild(nextScript);
    }
  }, []);

  return (
    <div className="mt-5 max-w-[220px] overflow-hidden bg-[var(--field)] p-3">
      <div
        ref={embedRef}
        className="tenor-gif-embed"
        data-postid="3349401281762803381"
        data-share-method="host"
        data-aspect-ratio="1"
        data-width="100%"
      >
        <a href="https://tenor.com/view/67-67-kid-edit-analog-horror-phonk-gif-3349401281762803381">
          67 67 Kid GIF
        </a>
        from{" "}
        <a href="https://tenor.com/search/67-gifs" id={`tenor-${fallbackId}`}>
          67 GIFs
        </a>
      </div>
    </div>
  );
}
