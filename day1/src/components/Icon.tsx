import type { SVGProps } from "react";

const paths = {
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4.5 20.5c1.2-3.8 4-5.5 7.5-5.5s6.3 1.7 7.5 5.5" /></>,
  heart: <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z" />,
  bag: <><path d="M5 8h14l-1 12.5H6L5 8Z" /><path d="M9 10V6.5a3 3 0 0 1 6 0V10" /></>,
  truck: <><path d="M2.5 6.5h11v10h-11z" /><path d="M13.5 10h4l3 3.5v3h-7" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></>,
  box: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="m4 7.5 8 4.5 8-4.5M12 12v9" /></>,
  "badge-check": <><path d="M12 3l2.3 1.6 2.8-.1.9 2.6 2.2 1.7-.9 2.7.9 2.7-2.2 1.7-.9 2.6-2.8-.1L12 21l-2.3-1.6-2.8.1-.9-2.6-2.2-1.7.9-2.7-.9-2.7 2.2-1.7.9-2.6 2.8.1L12 3Z" /><path d="m8.8 12 2.2 2.2 4.2-4.4" /></>,
  lock: <><rect x="5" y="10.5" width="14" height="10" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" /></>,
  upload: <><path d="M12 15.5V4M7.5 8.5 12 4l4.5 4.5" /><path d="M4 15v5h16v-5" /></>,
  camera: <><path d="M3.5 7.5h4l1.5-2.5h6l1.5 2.5h4v12h-17z" /><circle cx="12" cy="13" r="3.8" /></>,
  "figure-full": <><circle cx="12" cy="4" r="2" /><path d="M9 21v-7.5L7.5 13V8.5h9V13L15 13.5V21M12 13.5V21" /></>,
  "figure-half": <><circle cx="12" cy="6.5" r="2.8" /><path d="M5 21v-5a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v5" /></>,
  eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" /></>,
  "eye-off": <><path d="M4 4l16 16" /><path d="M9.9 6A9.8 9.8 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.8 3.6M6.4 7.4A16.8 16.8 0 0 0 2.5 12S6 18.5 12 18.5c1.5 0 2.9-.4 4.1-1" /></>,
  swap: <><path d="M4 8h14l-3.5-3.5M20 16H6l3.5 3.5" /></>,
  trash: <><path d="M4.5 6.5h15M9.5 6.5V4h5v2.5M6.5 6.5l1 14h9l1-14M10 10.5v6M14 10.5v6" /></>,
  "arrow-right": <path d="M4 12h16m-5.5-5.5L20 12l-5.5 5.5" />,
  "arrow-left": <path d="M20 12H4m5.5-5.5L4 12l5.5 5.5" />,
  close: <path d="M5.5 5.5l13 13m0-13-13 13" />,
  menu: <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />,
  check: <path d="m4.5 12.5 5 5 10-11" />,
  "check-circle": <><circle cx="12" cy="12" r="9" /><path d="m8 12.3 2.8 2.7 5.2-5.5" /></>,
  alert: <><path d="M12 3.5 21.5 20h-19L12 3.5Z" /><path d="M12 10v4.5M12 17.2v.3" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5.5M12 7.8v.3" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  "zoom-in": <><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2M11 8.5v5M8.5 11h5" /></>,
  "zoom-out": <><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2M8.5 11h5" /></>,
  compare: <><path d="M12 3v18" /><path d="M3.5 5.5h6v13h-6zM14.5 5.5h6v13h-6z" /></>,
  bookmark: <path d="M6.5 3.5h11v17L12 16.5l-5.5 4v-17Z" />,
  sparkle: <path d="M12 3.5c.6 4.2 2.3 6 6.5 6.5-4.2.6-5.9 2.3-6.5 6.5-.6-4.2-2.3-5.9-6.5-6.5 4.2-.5 5.9-2.3 6.5-6.5ZM18.5 15.5c.3 1.9 1 2.7 3 3-2 .3-2.7 1.1-3 3-.3-1.9-1-2.7-3-3 2-.3 2.7-1.1 3-3Z" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" /></>,
  image: <><rect x="3.5" y="4.5" width="17" height="15" /><circle cx="9" cy="9.5" r="1.6" /><path d="m3.5 17 5-5 4 4 3-3 5 5" /></>,
  pause: <path d="M8 5v14M16 5v14" />,
  replay: <><path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" /><path d="M4 4.5v4h4" /></>,
  play: <path d="M7 4.5v15L19.5 12 7 4.5Z" />,
  filter: <path d="M3.5 6h17M7 12h10M10 18h4" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  instagram: <><rect x="3.5" y="3.5" width="17" height="17" rx="4.5" /><circle cx="12" cy="12" r="4" /><path d="M17.3 6.7v.1" /></>,
  pinterest: <><circle cx="12" cy="12" r="9" /><path d="M10.5 20.5 12.5 12M9.3 13.8c-.5-2.8 1.2-5.3 3.8-5.3 2.2 0 3.4 1.5 3.4 3.3 0 2.4-1.2 4.2-3 4.2-1 0-1.7-.8-1.4-1.8" /></>,
  youtube: <><rect x="2.5" y="5.5" width="19" height="13" rx="3" /><path d="m10 9 5 3-5 3V9Z" /></>,
} as const;

export type IconName = keyof typeof paths;

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
  /** When set, the icon is announced; otherwise it is decorative. */
  label?: string;
}

export function Icon({ name, size = 20, label, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
