import { Splide, SplideSlide } from '@splidejs/react-splide';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

const Slideshow = () => {
    const [images, setImages] = useState([]);
    const splideRef = useRef(null);

    const apiUrl = 'http://localhost:5000/api/slideshow';

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const { data } = await axios.get(`${apiUrl}/get`);
                setImages(data);
            } catch (error) {
                console.error('Error fetching images:', error);
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
            <Splide
                ref={splideRef}
                options={{
                    type: 'slide',
                    perPage: 1,
                    autoplay: true,
                    interval: 3000,
                    pagination: true,
                    arrows: true,
                    width: '100%',
                    height: 'auto',
                    gap: '13px',
                    breakpoints: {
                        1024: { perPage: 1 },
                        600: { perPage: 1 },
                        480: { perPage: 1 },
                    },
                }}
                onMounted={() => splideRef.current?.splide.refresh()}
            >
                {images.length > 0 &&
                    images.map((image) => (
                        <SplideSlide key={image._id}>
                            <div className="flex justify-center items-center">
                                <img
                                    src={`http://localhost:5000/${image.image}`}
                                    alt={image.title}
                                    className="w-full max-w-[2000px] h-[800px] object-cover rounded-md"
                                    onLoad={() => splideRef.current?.splide.refresh()}
                                />
                            </div>
                        </SplideSlide>
                    ))}
                <div className="splide__progress">
                    <div className="splide__progress__bar"></div>
                </div>
            </Splide>
        </div>
    );
};

export default Slideshow;