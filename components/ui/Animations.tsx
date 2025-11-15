import React, { useEffect, useRef } from 'react';

export const useScrollReveal = (threshold = 0.1) => {
    const elementsRef = useRef<(HTMLElement | null)[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const target = entry.target as HTMLElement;
                        target.classList.add('is-revealed');

                        // Find any kinetic text children and apply staggered delays
                        const kineticText = target.querySelector('.kinetic-text-reveal');
                        if (kineticText) {
                            kineticText.querySelectorAll('span > span').forEach((span, index) => {
                                (span as HTMLElement).style.transitionDelay = `${index * 0.05}s`;
                            });
                        }
                        
                        observer.unobserve(target);
                    }
                });
            },
            { threshold }
        );

        elementsRef.current.forEach((el) => {
            if (el) observer.observe(el);
        });

        return () => {
            elementsRef.current.forEach((el) => {
                if (el) observer.unobserve(el);
            });
        };
    }, [threshold]);

    const addToRefs = (el: HTMLElement | null) => {
        if (el && !elementsRef.current.includes(el)) {
            elementsRef.current.push(el);
        }
    };

    return addToRefs;
};

export const KineticText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
    return (
        <span className={`kinetic-text-reveal ${className || ''}`}>
            {text.split(' ').map((word, index) => (
                <span key={index}>
                    <span>{word}&nbsp;</span>
                </span>
            ))}
        </span>
    );
};
