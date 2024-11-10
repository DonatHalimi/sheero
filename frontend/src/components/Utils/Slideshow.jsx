import { Splide } from '@splidejs/react-splide';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { ImageSlide, SlideshowSkeleton, splideOptions } from '../../assets/CustomComponents';
import { getApiUrl } from '../../config';

const Slideshow = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    const splideRef = useRef(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const { data } = await axios.get(getApiUrl('/slideshow/get'));
                setImages(data);
            } catch (error) {
                console.error('Error fetching images:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    useEffect(() => {
        if (images.length > 0 && splideRef.current) {
            splideRef.current.splide.refresh();
        }
    }, [images]);

    return (
        <div className="w-full mx-auto mb-14">
            {loading ? (
                <SlideshowSkeleton />
            ) : (
                <Splide ref={splideRef} options={splideOptions} onMounted={() => splideRef.current?.splide.refresh()}>
                    {images.map((image) => (
                        <ImageSlide
                            key={image._id}
                            image={image}
                            onLoad={() => splideRef.current?.splide.refresh()}
                        />
                    ))}
                </Splide>
            )}
        </div>
    );
};

export default Slideshow;