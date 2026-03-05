import * as React from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

interface ScrollBounceProps {
    readonly children: React.ReactNode;
    readonly className?: string;
    readonly id?: string;
    readonly role?: string;
}

/**
 * ScrollBounce provides a global "rubber-band" or overscroll-bounce effect
 * when the user reaches the top or bottom of the page content.
 */
export default function ScrollBounce({ children, className, id, role }: ScrollBounceProps) {
    const y = useMotionValue(0);
    // Using a tight spring for a more "premium" feel (higher stiffness, lower mass)
    const springY = useSpring(y, { stiffness: 450, damping: 35, mass: 0.8 });
    const containerRef = React.useRef<HTMLDivElement>(null);
    const wheelTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    React.useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        // --- Wheel Support (Desktop) ---
        const handleWheel = (e: WheelEvent) => {
            const { scrollTop, scrollHeight, clientHeight } = el;

            const isAtTop = scrollTop <= 0 && e.deltaY < 0;
            const isAtBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight - 1 && e.deltaY > 0;

            if (isAtTop || isAtBottom) {
                // Accumulate a small "pull" to simulate the rubber band
                const resistance = 0.25;
                const currentPull = y.get();
                const nextPull = currentPull - e.deltaY * resistance;

                // Cap the bounce to prevent crazy offsets
                const limit = 80;
                y.set(Math.max(-limit, Math.min(limit, nextPull)));

                // Return to center (spring will animate this smoothly)
                if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
                wheelTimeout.current = setTimeout(() => {
                    y.set(0);
                }, 50);

                // Prevent browser's static stop
                if (e.cancelable) e.preventDefault();
            }
        };

        // --- Touch Support (Mobile/Desktop Touch) ---
        let touchStartY = 0;
        let isOverscrolling = false;

        const handleTouchStart = (e: TouchEvent) => {
            touchStartY = e.touches[0].clientY;
            const { scrollTop, scrollHeight, clientHeight } = el;
            isOverscrolling = scrollTop <= 0 || Math.ceil(scrollTop + clientHeight) >= scrollHeight - 1;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isOverscrolling) return;

            const currentTouchY = e.touches[0].clientY;
            const deltaTouchY = currentTouchY - touchStartY;
            const { scrollTop, scrollHeight, clientHeight } = el;

            const isAtTopBoundary = scrollTop <= 0 && deltaTouchY > 0;
            const isAtBottomBoundary = Math.ceil(scrollTop + clientHeight) >= scrollHeight - 1 && deltaTouchY < 0;

            if (isAtTopBoundary || isAtBottomBoundary) {
                // Pull tension
                y.set(deltaTouchY * 0.45);
                if (e.cancelable) e.preventDefault();
            } else {
                // We've moved back into normal scroll territory
                isOverscrolling = false;
                y.set(0);
            }
        };

        const handleTouchEnd = () => {
            isOverscrolling = false;
            y.set(0);
        };

        el.addEventListener('wheel', handleWheel, { passive: false });
        el.addEventListener('touchstart', handleTouchStart, { passive: true });
        el.addEventListener('touchmove', handleTouchMove, { passive: false });
        el.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            el.removeEventListener('wheel', handleWheel);
            el.removeEventListener('touchstart', handleTouchStart);
            el.removeEventListener('touchmove', handleTouchMove);
            el.removeEventListener('touchend', handleTouchEnd);
            if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
        };
    }, [y]);

    return (
        <div
            id={id}
            role={role}
            ref={containerRef}
            className={`flex-1 overflow-y-auto overflow-x-hidden relative overscroll-y-none isolate ${className}`}
        >
            <motion.div
                style={{ y: springY }}
                className="min-h-full w-full will-change-transform"
            >
                {children}
            </motion.div>
        </div>
    );
}
