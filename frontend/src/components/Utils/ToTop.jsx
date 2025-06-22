import { ArrowUpward } from '@mui/icons-material';
import { animate } from 'framer-motion';
import { useEffect, useState } from 'react';

const ToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setIsVisible(window.scrollY > 100);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollToTop = () => {
        animate(window.scrollY, 0, {
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
            onUpdate(latest) {
                window.scrollTo(0, latest);
            },
        });
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