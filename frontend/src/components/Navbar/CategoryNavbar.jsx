import { ChevronRight, Person } from '@mui/icons-material';
import { Skeleton } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { CartIcon, CategoryDropdown, HomeIcon, WishlistIcon } from '../../assets/CustomComponents';
import { getImageUrl } from '../../config';
import { getCategories, getSubcategoriesAndSubsubcategories } from '../../store/actions/categoryActions';

const CategoryNavbar = ({ isSidebarOpen, toggleSidebar }) => {
    const { categories, subcategories, subsubcategories, loading } = useSelector((state) => state.categories);
    const { isAuthenticated } = useSelector(state => state.auth) || {};
    const dispatch = useDispatch();

    const [openCategory, setOpenCategory] = useState(null);
    const [activeCategory, setActiveCategory] = useState('');
    const [dropdownLoading, setDropdownLoading] = useState(true);

    const categoryListRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    useEffect(() => {
        if (activeCategory) {
            setDropdownLoading(true);
            dispatch(getSubcategoriesAndSubsubcategories(activeCategory))
                .finally(() => setDropdownLoading(false));
        }
    }, [activeCategory, dispatch]);

    const handleCategoryHover = async (categoryId) => {
        setOpenCategory(categoryId);
        setDropdownLoading(true);
        await dispatch(getSubcategoriesAndSubsubcategories(categoryId));
        setDropdownLoading(false);
    };

    const handleCategoryLeave = () => {
        setOpenCategory(null);
    };

    useEffect(() => {
        const pathArray = location.pathname.split('/');
        const categoryId = pathArray[3] || '';
        setActiveCategory(categoryId);
    }, [location]);

    const handleNavigation = (path, categoryId) => {
        setActiveCategory(categoryId);
        navigate(path);

        if (isSidebarOpen) {
            toggleSidebar();
        }
    };

    const toggleSubcategories = (categoryId, event) => {
        event.stopPropagation();
        setOpenCategory(openCategory === categoryId ? null : categoryId);
        dispatch(getSubcategoriesAndSubsubcategories(categoryId))
    };

    const calculateDropdownStyle = () => {
        if (categoryListRef.current) {
            const { width, left, bottom } = categoryListRef.current.getBoundingClientRect();
            return { width: `${width}px`, left: `${left}px`, top: `${bottom}px` };
        }
        return {};
    };

    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            setOpenCategory(null);
        }
    }, [isSidebarOpen]);

    const handlers = useSwipeable({
        onSwipedRight: () => {
            if (!isSidebarOpen) {
                toggleSidebar();
            }
        },
        onSwipedLeft: () => {
            if (isSidebarOpen) {
                toggleSidebar();
            }
        },
        preventDefaultTouchmoveEvent: true,
    });

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            toggleSidebar();
        }
    };

    return (
        <>
            {(isSidebarOpen || openCategory) && (
                <div
                    onClick={handleBackdropClick}
                    className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${isSidebarOpen ? 'opacity-50' : openCategory ? 'opacity-50' : 'opacity-0'}`}
                />
            )}

            {/* Desktop screens */}
            <nav className="hidden lg:block bg-white shadow-sm border-t border-gray-50 relative z-50">
                <div className="flex justify-between items-center mx-auto max-w-screen-xl p-4 relative z-50">
                    <div className="items-center justify-between font-medium w-full">
                        <ul ref={categoryListRef} className="flex space-x-9 rtl:space-x-reverse">
                            {loading ? (
                                Array(10).fill().map((_, index) => (
                                    <Skeleton variant="text" animation="wave" width={100} height={40} />
                                ))
                            ) : (
                                categories.map((category) => (
                                    <div
                                        key={category._id}
                                        onMouseEnter={() => handleCategoryHover(category._id)}
                                        onMouseLeave={handleCategoryLeave}
                                        className="relative"
                                    >
                                        <button
                                            className={`flex items-center justify-between w-full py-2 px-3 text-gray-900 rounded md:w-auto md:border-0 md:p-0 ${activeCategory === category._id ? 'bg-gray-200 px-4' : 'hover:bg-stone-400 md:hover:bg-transparent md:hover:text-stone-600'}`}
                                            onClick={() => handleNavigation(`/category/${category._id}`, category._id)}
                                        >
                                            {category.name}
                                        </button>
                                        {openCategory === category._id && (
                                            <CategoryDropdown
                                                category={category}
                                                subcategories={subcategories}
                                                subsubcategories={subsubcategories}
                                                navigate={handleNavigation}
                                                dropdownStyle={calculateDropdownStyle}
                                                loading={dropdownLoading}
                                            />
                                        )}
                                    </div>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Mobile screens */}
            <div div
                {...handlers}
                onClick={(e) => e.stopPropagation()}
                className={`fixed top-0 left-0 w-80 h-full bg-white z-[1000] transition-transform transform duration-500 ease-in-out overflow-y-auto ${isSidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}
            >
                <div className="p-2 border-b flex flex-col items-start">
                    <div className='-mx-0 h-12 bg-stone-500 flex items-center justify-between w-full rounded-md mb-2 !p-0'>
                        <h1 className="text-white font-bold text-lg pl-3 cursor-pointer" onClick={() => navigate('/')}>
                            sheero
                        </h1>
                        <div className="flex items-center pr-3">
                            <button onClick={() => navigate('/profile/me')} className="text-white hover:opacity-80 mr-1">
                                {isAuthenticated ? (
                                    <Person />
                                ) : null}
                            </button>
                        </div>
                    </div>

                    <button onClick={() => navigate('/')} className='flex items-center rounded w-full text-left mb-2'>
                        <HomeIcon color='primary' />
                        Home
                    </button>

                    <button onClick={() => navigate('/cart')} className='flex items-center rounded w-full text-left mb-2'>
                        <CartIcon color='primary' />
                        Cart
                    </button>

                    <button onClick={() => navigate('/profile/wishlist')} className='flex items-center rounded w-full text-left'>
                        <WishlistIcon color='primary' />
                        Wishlist
                    </button>
                </div>

                <ul className="p-4">
                    {loading ? (
                        Array(10).fill().map((_, index) => (
                            <li key={index} className="mb-4">
                                <Skeleton variant="text" animation="wave" height={40} />
                            </li>
                        ))
                    ) : (
                        categories.map((category, index) => (
                            <li
                                key={category._id}
                                className={`mb-4 ${index === categories.length - 1 ? 'mb-[2px]' : ''}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className='border-t bg-gray-50' />
                                    <img
                                        src={getImageUrl(category.image)}
                                        alt=""
                                        className='object-contain w-6 h-6'
                                    />
                                    <button
                                        onClick={() => handleNavigation(`/category/${category._id}`, category._id)}
                                        className={`flex-grow text-left p-2 ml-2 ${activeCategory === category._id ? 'bg-gray-100' : ''}`}
                                    >
                                        {category.name}
                                    </button>
                                    <button
                                        onClick={(e) => toggleSubcategories(category._id, e)}
                                        className={`p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition duration-200 ${openCategory === category._id ? 'rotate-90' : ''}`}
                                    >
                                        <ChevronRight />
                                    </button>
                                </div>
                                {openCategory === category._id && (
                                    <ul className="ml-2">
                                        {subcategories[category._id]?.map((subcategory) => (
                                            <li key={subcategory._id} className='mb-2 ml-3'>
                                                <div className="flex items-center">
                                                    <img
                                                        src={getImageUrl(subcategory.image)}
                                                        alt=""
                                                        className='object-contain w-6 h-6'
                                                    />
                                                    <button
                                                        onClick={() => handleNavigation(`/subcategory/${subcategory._id}`, category._id)}
                                                        className="block py-1 px-2 mt-[2px] text-gray-700 hover:bg-gray-100"
                                                    >
                                                        {subcategory.name}
                                                    </button>
                                                </div>
                                                {subsubcategories[subcategory._id]?.length > 0 && (
                                                    <ul className="pl-4">
                                                        {subsubcategories[subcategory._id].map((subsubcategory) => (
                                                            <div key={subsubcategory._id} className="flex items-center mb-1">
                                                                <div className="rounded-md mr-9" />
                                                                <button
                                                                    onClick={() => handleNavigation(`/subSubcategory/${subsubcategory._id}`, category._id)}
                                                                    className="block py-1 text-gray-500 hover:bg-gray-100"
                                                                >
                                                                    {subsubcategory.name}
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))
                    )}
                </ul>

                <div className='border-t bg-gray-50 mb-4' />

                <div className="flex flex-col text-gray-400 gap-3">
                    <span
                        onClick={() => navigate('/faqs')}
                        className="text-sm ml-7 underline"
                    >
                        Frequently Asked Questions
                    </span>
                    <span
                        onClick={() => navigate('/contact-us')}
                        className="text-sm ml-7 underline">Contact us:</span>
                    <span className="text-sm ml-7">Email: support@sheero.com</span>
                    <span className="text-sm ml-7 mb-10">Tel.: 044888999</span>
                </div>
            </div >
        </>
    );
};

export default CategoryNavbar;