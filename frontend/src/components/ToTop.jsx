import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import React, { useEffect, useState } from 'react';

const ToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        const c = document.documentElement.scrollTop || document.body.scrollTop;
        if (c > 0) {
            window.requestAnimationFrame(scrollToTop);
            window.scrollTo(0, c - c / 11);
        }
    };

    return (
        <div>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className={`to-top-button ${isVisible ? 'visible' : ''}`}
                >
                    <ArrowUpwardIcon className="to-top-arrow" />
                </button>
            )}
        </div>
    );
};

export default ToTop;