import { Splide } from '@splidejs/react-splide';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ImageSlide, LoadingSlideshow, splideOptions } from '../../assets/CustomComponents';
import { getImages } from '../../store/actions/slideshowActions';

const Slideshow = () => {
    const { images, loading } = useSelector((state) => state.slideshow);
    const splideRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getImages());
    }, [dispatch]);

    useEffect(() => {
        if (images.length > 0 && splideRef.current) {
            splideRef.current.splide.refresh();
        }
    }, [images]);

    return (
        <div className="w-full mx-auto mb-14">
            {loading ? (
                <LoadingSlideshow />
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