/**
 * Subtle topographic contour-line SVG background.
 * Drop inside any relative-positioned dark section.
 */
export const TopoBackground = ({ opacity = 0.07 }: { opacity?: number }) => (
    <svg
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 640"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
    >
        <g fill="none" stroke="white" strokeWidth="1.1" strokeLinecap="round">
            {/* Row 1 — near top */}
            <path opacity={opacity * 0.6} d="M -100 28 C 80 12 220 42 420 22 C 600 4 760 38 980 18 C 1120 6 1300 32 1540 14" />
            <path opacity={opacity} d="M -100 60 C 100 44 260 74 460 55 C 660 36 820 70 1040 50 C 1180 36 1360 62 1540 44" />

            {/* Row 2 */}
            <path opacity={opacity * 0.7} d="M -100 102 C 120 88 300 115 500 96 C 700 78 860 108 1060 90 C 1220 76 1380 100 1540 84" />
            <path opacity={opacity} d="M -100 138 C 80 120 240 152 460 132 C 660 114 840 146 1040 128 C 1200 114 1380 138 1540 122" />

            {/* Row 3 — slight convergence left */}
            <path opacity={opacity * 0.5} d="M -100 172 C 60 162 160 182 340 172 C 500 163 660 180 840 168 C 1020 157 1220 178 1540 164" />
            <path opacity={opacity} d="M -100 210 C 140 194 320 222 540 204 C 720 188 900 216 1100 198 C 1260 184 1420 208 1540 194" />

            {/* Row 4 — more curvature */}
            <path opacity={opacity * 0.8} d="M -100 256 C 100 238 260 268 480 246 C 660 228 840 262 1060 242 C 1240 226 1400 252 1540 236" />
            <path opacity={opacity} d="M -100 295 C 120 278 300 306 520 286 C 700 268 880 300 1080 280 C 1260 264 1420 290 1540 274" />

            {/* Row 5 — centre band, denser */}
            <path opacity={opacity * 0.6} d="M -100 330 C 80 316 240 342 460 324 C 640 308 820 336 1020 318 C 1200 304 1380 328 1540 314" />
            <path opacity={opacity} d="M -100 368 C 140 352 320 378 540 360 C 740 344 920 372 1120 354 C 1280 340 1440 364 1540 350" />
            <path opacity={opacity * 0.5} d="M -100 400 C 100 388 260 410 480 394 C 660 380 840 404 1040 388 C 1220 374 1400 396 1540 382" />

            {/* Row 6 */}
            <path opacity={opacity} d="M -100 438 C 120 422 300 450 520 430 C 700 414 880 444 1080 424 C 1260 408 1420 434 1540 418" />
            <path opacity={opacity * 0.7} d="M -100 474 C 80 460 240 486 460 468 C 640 452 820 480 1020 462 C 1200 448 1380 472 1540 456" />

            {/* Row 7 — bottom, wider spacing */}
            <path opacity={opacity} d="M -100 520 C 140 504 320 530 540 512 C 720 496 920 526 1120 506 C 1300 490 1460 516 1540 500" />
            <path opacity={opacity * 0.6} d="M -100 568 C 100 554 280 578 500 560 C 700 544 880 572 1100 552 C 1280 536 1420 560 1540 546" />
            <path opacity={opacity * 0.4} d="M -100 610 C 120 598 300 618 520 602 C 720 588 900 612 1100 594 C 1280 580 1440 604 1540 590" />
        </g>
    </svg>
);
