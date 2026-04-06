import type { CSSProperties } from "react";

import type {
  BuildCardInteraction,
  FinalCardInteraction,
} from "@/lib/build-nothing";

export function getDisplayedCardShellStyle(
  activeInteractionType?: BuildCardInteraction["type"] | FinalCardInteraction["type"],
  finalInteractionType?: FinalCardInteraction["type"],
  isComplete = false,
) {
  return getCardShellStyle(isComplete ? finalInteractionType : activeInteractionType);
}

export function getCardShellStyle(
  interactionType?: BuildCardInteraction["type"] | FinalCardInteraction["type"],
): CSSProperties | undefined {
  if (interactionType !== "ugly-gradients") {
    return undefined;
  }

  return {
    backgroundImage:
      "radial-gradient(circle at 0% 0%, rgba(255, 84, 131, 0.35), transparent 30%), linear-gradient(135deg, #281046 0%, #3d1761 24%, #174f8b 50%, #0b8f7b 76%, #21351b 100%)",
    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.03)",
  };
}
