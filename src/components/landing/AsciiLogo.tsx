import { BRAILLE_BODY, BRAILLE_LEGS, BRAILLE_SHADOW } from "./braille-data";

export function AsciiBraille({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`ascii-braille ascii-mark select-none text-[10px] sm:text-[11px] md:text-xs ${className ?? ""}`}
    >
      <pre className="ascii-x m-0">{BRAILLE_BODY}</pre>
      <pre className="m-0 text-muted">{BRAILLE_LEGS}</pre>
    </div>
  );
}

/**
 * Same mark with the drop shadow drawn in real block-ASCII characters
 * (U+2591-U+2593 shading, stepped to the lower-right), not CSS.
 */
export function AsciiBrailleShadow({ className }: { className?: string }) {
  return (
    <pre
      aria-hidden="true"
      className={`ascii-braille ascii-mark ascii-x m-0 select-none text-[10px] sm:text-[11px] md:text-xs ${className ?? ""}`}
    >
      {BRAILLE_SHADOW}
    </pre>
  );
}
