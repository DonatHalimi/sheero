import { Splide } from '@splidejs/react-splide';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { LoadingSlideshow } from '../../components/custom/LoadingSkeletons';
import { ImageSlide, splideOptions } from '../../components/custom/Splide';

const Slideshow = () => {
    const { images, loading } = useSelector((state) => state.slideshow);
    const splideRef = useRef(null);

    useEffect(() => {
        if (images.length > 0 && splideRef.current) {
            splideRef.current.splide.refresh();
        }
    }, [images]);

    return (
        <div className="w-full mx-auto mb-9">
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