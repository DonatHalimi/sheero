import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import { FormControl, IconButton, InputLabel, MenuItem, Select } from "@mui/material";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { useEffect, useRef, useState } from "react";
import { getImageUrl } from "../../utils/config/config";
import { LoadingSplide } from "../custom/LoadingSkeletons";
import { truncateText } from "./utils";

/**
 * @file Splide.jsx
 * @description A collection of custom Splide components for lists and slideshows.
 *
 * This file includes Splide components used for displaying category, subcategory and subsubcategory lists
 * as well as the main slideshow, ensuring smooth and consistent carousel functionality across the application.
 */

export const ImageSlide = ({ image, onLoad }) => (
    <SplideSlide>
        <div className="flex justify-center items-center">
            <img
                src={getImageUrl(image.image)}
                alt={image.title}
                onLoad={onLoad}
                style={{ width: '1920px', height: '500px' }}
                className="object-cover rounded-md"
            />
        </div>
    </SplideSlide>
);

export const splideOptions = {
    type: 'slide',
    perPage: 1,
    autoplay: true,
    interval: 3000,
    pagination: true,
    arrows: true,
    width: '100%',
    height: 'auto',
    gap: '11px',
    breakpoints: {
        1024: { perPage: 1 },
        600: { perPage: 1 },
        480: { perPage: 1 },
    },
};

export const useScrollAwayMenu = () => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleScroll = (e) => {
            if (!open) return;

            const menuElement = menuRef.current;
            if (!menuElement) return;

            const menuRect = menuElement.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            if (menuRect.bottom < 0 || menuRect.top > viewportHeight) {
                setOpen(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [open]);

    const menuProps = {
        disableScrollLock: true,
        disableRestoreFocus: true,
        anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
        },
        transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
        }
    };

    return {
        open,
        setOpen,
        menuRef,
        menuProps,
        menuHandlers: {
            onOpen: () => setOpen(true),
            onClose: () => setOpen(false)
        }
    };
};

export const splideCardsOptions = {
    type: 'slide',
    perPage: 3,
    breakpoints: {
        768: { perPage: 2 },
        480: { perPage: 1 },
    },
    gap: '1rem',
    pagination: false,
    drag: true,
    arrows: false,
    speed: 1000,
    easing: 'cubic-bezier(1, 1, 1, 1)',
    rewind: false,
    rewindSpeed: 1000,
    waitForTransition: true,
};

const SplideSlides = ({ items, onCardClick, showImage, splideRef }) => (
    <Splide
        ref={splideRef}
        options={splideCardsOptions}
    >
        {items.map(item => (
            <SplideSlide key={item._id}>
                <div
                    onClick={() => onCardClick(item.slug)}
                    className="flex items-center p-4 bg-white rounded-md cursor-pointer hover:underline hover:shadow-lg transition-shadow duration-300"
                >
                    {showImage && (
                        <img
                            src={getImageUrl(item.image)}
                            alt={item.name}
                            className="object-contain mr-3 w-7 h-7"
                        />
                    )}
                    <span className="font-medium text-base">{truncateText(item.name, 24)}</span>
                </div>
            </SplideSlide>
        ))}
    </Splide>
);

const SplideArrows = ({ loading, items, id, handlePrev, isBeginning, handleNext, isEnd }) => {
    if (loading || (isBeginning && isEnd) || !items[id]?.length || items[id].length == 1) return null;

    return (
        <div className="flex justify-end mt-2 space-x-2">
            <IconButton
                onClick={handlePrev}
                color="primary"
                aria-label="Previous slide"
                size="small"
                disabled={isBeginning}
                className={isBeginning ? 'opacity-50 cursor-not-allowed' : ''}
            >
                <ArrowBackIosNew fontSize="small" />
            </IconButton>
            <IconButton
                onClick={handleNext}
                color="primary"
                aria-label="Next slide"
                size="small"
                disabled={isEnd}
                className={isEnd ? 'opacity-50 cursor-not-allowed' : ''}
            >
                <ArrowForwardIos fontSize="small" />
            </IconButton>
        </div>
    );
};

const SplideSort = ({ sortOrder, onSortChange, showTopStyle = true }) => {
    const { open, menuRef, menuProps, menuHandlers } = useScrollAwayMenu();

    return (
        <div className={`flex justify-between items-baseline ${showTopStyle ? 'relative top-1' : ''}`}>
            <p className="text-base text-stone-600">Products</p>
            <div ref={menuRef}>
                <FormControl variant="outlined" size="small" className="w-56">
                    <InputLabel>Sort By</InputLabel>
                    <Select
                        open={open}
                        {...menuHandlers}
                        value={sortOrder}
                        onChange={onSortChange}
                        label="Sort By"
                        MenuProps={menuProps}
                    >
                        <MenuItem value="relevancy">Relevancy</MenuItem>
                        <MenuItem value="lowToHigh">Price: Low to High</MenuItem>
                        <MenuItem value="highToLow">Price: High to Low</MenuItem>
                        <MenuItem value="newest">Newest</MenuItem>
                        <MenuItem value="highestSale">Highest sale percentage</MenuItem>
                    </Select>
                </FormControl>
            </div>
        </div>
    );
};

export const SplideList = ({
    items = {},
    id,
    loading,
    onCardClick,
    showImage = true,
    sortOrder,
    onSortChange,
    showSplide = true,
    showTopStyle = true,
}) => {
    const [skeletonCount, setSkeletonCount] = useState(1);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
    const splideRef = useRef(null);

    useEffect(() => {
        const updateSkeletonCount = () => setSkeletonCount(window.innerWidth >= 768 ? 3 : 1);
        const updateViewType = () => setIsMobileView(window.innerWidth < 768);

        updateSkeletonCount();
        updateViewType();

        window.addEventListener('resize', updateSkeletonCount);
        window.addEventListener('resize', updateViewType);

        return () => {
            window.removeEventListener('resize', updateSkeletonCount);
            window.removeEventListener('resize', updateViewType);
        };
    }, []);

    useEffect(() => {
        if (splideRef.current && splideRef.current.splide) {
            const splide = splideRef.current.splide;

            const applyAnimationSettings = () => {
                splide.options = {
                    ...splide.options,
                    speed: 800,
                    easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
                    rewind: false,
                    rewindSpeed: 800,
                    waitForTransition: true,
                };
            };

            const updateButtons = () => {
                setIsBeginning(splide.index === 0);
                setIsEnd(splide.index === splide.length - splide.options.perPage);
            };

            splide.off('mounted');
            splide.off('moved');
            splide.off('resize');
            splide.off('drag');
            splide.off('dragged');
            splide.off('updated');

            applyAnimationSettings();
            updateButtons();

            splide.on('mounted', () => {
                applyAnimationSettings();
                updateButtons();
            });

            splide.on('moved', updateButtons);
            splide.on('resize', updateButtons);

            splide.on('drag', () => { });

            splide.on('dragged', () => {
                applyAnimationSettings();
                updateButtons();
            });

            splide.on('updated', () => {
                applyAnimationSettings();
                updateButtons();
            });
        }
    }, [items, id]);

    const handlePrev = () => {
        if (!splideRef.current || !splideRef.current.splide) return;

        const splide = splideRef.current.splide;

        splide.options = {
            ...splide.options,
            speed: 800,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
            waitForTransition: true,
        };

        splide.go('-' + splide.options.perPage);
    };

    const handleNext = () => {
        if (!splideRef.current || !splideRef.current.splide) return;

        const splide = splideRef.current.splide;

        splide.options = {
            ...splide.options,
            speed: 800,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
            waitForTransition: true,
        };

        splide.go('+' + splide.options.perPage);
    };

    const currentItems = items[id] || [];
    const showArrows = isMobileView || currentItems.length >= 3;

    return (
        <>
            {showSplide && (
                <div className="max-w-[870px] mb-11">
                    {loading ? (
                        <LoadingSplide count={skeletonCount} />
                    ) : (
                        <SplideSlides
                            items={currentItems}
                            onCardClick={onCardClick}
                            showImage={showImage}
                            splideRef={splideRef}
                        />
                    )}
                    {showArrows && (
                        <SplideArrows
                            loading={loading}
                            items={items}
                            id={id}
                            handlePrev={handlePrev}
                            isBeginning={isBeginning}
                            handleNext={handleNext}
                            isEnd={isEnd}
                        />
                    )}
                </div>
            )}
            <SplideSort sortOrder={sortOrder} onSortChange={onSortChange} showTopStyle={showTopStyle} />
        </>
    );
};