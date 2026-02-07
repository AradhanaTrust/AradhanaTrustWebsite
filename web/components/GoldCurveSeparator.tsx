"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";

interface GoldCurveSeparatorProps {
    fillColor?: string;
    className?: string;
}

export default function GoldCurveSeparator({
    fillColor = "fill-background-ivory",
    className = ""
}: GoldCurveSeparatorProps) {
    const ref = useRef(null);

    // Animate curve flattening as the separator scrolls through the viewport
    // start end: When the top of the separator enters the bottom of the viewport (Enters view) -> Curve is Deep (320)
    // end start: When the bottom of the separator leaves the top of the viewport (Leaves view) -> Curve is Flat (190)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const curveControlY = useTransform(scrollYProgress, [0, 1], [320, 190]);
    const curveControlY_Line1 = useTransform(curveControlY, (y) => y + 1.5);
    const curveControlY_Line2 = useTransform(curveControlY, (y) => y + 12);

    const pathMain = useMotionTemplate`M0,190 Q600,${curveControlY} 1200,190 L1200,280 L0,280 Z`;
    const pathLine1 = useMotionTemplate`M0,191.5 Q600,${curveControlY_Line1} 1200,191.5`;
    const pathLine2 = useMotionTemplate`M0,202 Q600,${curveControlY_Line2} 1200,202`;

    return (
        <div ref={ref} className={`absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 pointer-events-none ${className}`}>
            <svg
                className="relative block w-[calc(100%+1.3px)] h-[160px] md:h-[280px]"
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1200 280"
                preserveAspectRatio="none"
            >
                {/* Main Fill (Background of next section) */}
                <motion.path d={pathMain} className={fillColor} stroke="none"></motion.path>

                {/* Double Gold Lines */}
                {/* Upper Line (Darker Gold) */}
                <motion.path d={pathLine1} fill="none" stroke="url(#goldGradientSeparator)" strokeWidth="3" className="drop-shadow-sm"></motion.path>

                {/* Lower Line (Lighter/Thinner) */}
                <motion.path d={pathLine2} fill="none" stroke="#D4AF37" strokeWidth="1.5" opacity="0.6"></motion.path>

                <defs>
                    <linearGradient id="goldGradientSeparator" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#D4AF37" />
                        <stop offset="50%" stopColor="#F4C430" />
                        <stop offset="100%" stopColor="#B8860B" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}
