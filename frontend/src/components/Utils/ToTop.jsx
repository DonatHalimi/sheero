import { ArrowUpward } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';

const ToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        const scrollPosition = window.scrollY || document.body.scrollTop;
        if (scrollPosition > 0) {
            window.requestAnimationFrame(() => {
                window.scrollTo(0, scrollPosition - scrollPosition / 25);
                scrollToTop();
            });
        }
    };

    return (
        <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className={`to-top-button ${isVisible ? 'visible' : 'hidden'}`}
        >
            <ArrowUpward className="to-top-arrow" />
        </button>
    );
};

export default ToTop;