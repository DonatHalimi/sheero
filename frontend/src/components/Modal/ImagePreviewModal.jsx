import { Modal } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { ImagePreviewControls, MAX_ZOOM_LEVEL, StyledImage, ZOOM_FACTOR } from '../../assets/CustomComponents';

const ImagePreviewModal = ({ open, onClose, imageUrl }) => {
    const [scale, setScale] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const adjustZoom = (direction) =>
        setScale((prev) => (direction === 'in' ? Math.min(MAX_ZOOM_LEVEL, prev + ZOOM_FACTOR) : Math.max(1, prev - ZOOM_FACTOR)));

    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement) await containerRef.current.requestFullscreen();
            else await document.exitFullscreen();
        } catch (err) {
            console.error('Error toggling fullscreen:', err);
        }
    };

    const resetAndClose = () => {
        setScale(1);
        onClose();
    };

    return (
        <Modal open={open} onClose={resetAndClose}>
            <div ref={containerRef} onClick={resetAndClose} className={`fixed inset-0 flex items-center justify-center bg-white ${isFullscreen ? 'w-screen h-screen' : ''}`}>
                <ImagePreviewControls
                    scale={scale}
                    setScale={setScale}
                    isFullscreen={isFullscreen}
                    adjustZoom={adjustZoom}
                    toggleFullscreen={toggleFullscreen}
                    resetAndClose={resetAndClose}
                />

                <StyledImage
                    src={imageUrl}
                    alt="Preview"
                    onClick={(e) => e.stopPropagation()}
                    style={{ transform: `scale(${scale})` }}
                    className={`transform transition-transform duration-200 ${isFullscreen ? 'max-w-screen max-h-screen' : 'max-w-[80%] max-h-[80%]'}`}
                />
            </div>
        </Modal>
    );
};

export default ImagePreviewModal;