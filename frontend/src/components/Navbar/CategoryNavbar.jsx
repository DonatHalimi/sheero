import { ChevronRight } from '@mui/icons-material';
import { Link, Skeleton } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { CartIcon, HomeIcon, WishlistIcon } from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';
import { getImageUrl } from '../../config';

const CategoryNavbar = ({ isSidebarOpen, toggleSidebar }) => {
    const axiosInstance = useAxios();
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState({});
    const [subsubcategories, setSubsubcategories] = useState({});
    const [openCategory, setOpenCategory] = useState(null);
    const [activeCategory, setActiveCategory] = useState('');
    const [loading, setLoading] = useState(!categories.length);

    const categoryListRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();  // Track the current URL

    useEffect(() => {
        if (!categories.length) {
            const fetchCategories = async () => {
                try {
                    const { data } = await axiosInstance.get('/categories/get');
                    setCategories(data);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching categories:', error);
                    setLoading(false);
                }
            };
            fetchCategories();
        }
    }, [axiosInstance, categories.length]);

    const fetchSubcategories = async (categoryId) => {
        if (!subcategories[categoryId]) {
            try {
                const { data } = await axiosInstance.get(`/subcategories/get-by-category/${categoryId}`);
                setSubcategories(prev => ({ ...prev, [categoryId]: data }));
                data.forEach(subcategory => fetchSubsubcategories(subcategory._id));
            } catch (error) {
                console.error('Error fetching subcategories:', error);
            }
        }
    };

    const fetchSubsubcategories = async (subcategoryId) => {
        if (!subsubcategories[subcategoryId]) {
            try {
                const { data } = await axiosInstance.get(`/subsubcategories/get-by-subCategory/${subcategoryId}`);
                setSubsubcategories(prev => ({ ...prev, [subcategoryId]: data }));
            } catch (error) {
                console.error('Error fetching subsubcategories:', error);
            }
        }
    };

    const handleCategoryHover = (categoryId) => {
        setOpenCategory(categoryId);
        fetchSubcategories(categoryId);
    };

    const handleCategoryLeave = () => {
        setOpenCategory(null);
    };

    useEffect(() => {
        const pathArray = location.pathname.split('/');  // Split the URL path into segments
        const categoryId = pathArray[3] || '';  // Get the category ID from the path (assuming it's in the 4th position)
        setActiveCategory(categoryId);  // Set the active category based on the URL
    }, [location]);

    const handleNavigation = (path, categoryId) => {
        setActiveCategory(categoryId);
        navigate(path);
    };

    const toggleSubcategories = (categoryId, event) => {
        event.stopPropagation();
        setOpenCategory(openCategory === categoryId ? null : categoryId);
        fetchSubcategories(categoryId);
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

    return (
        <>
            {isSidebarOpen && (<div onClick={toggleSidebar} className="fixed inset-0 bg-black opacity-50 z-40" />)}

            {openCategory && (<div className="fixed inset-0 bg-black opacity-50 z-40" />)}

            {/* Desktop screens */}
            <nav className="hidden lg:block bg-white shadow-sm border-t border-gray-50 relative z-50">
                <div className="flex justify-between items-center mx-auto max-w-screen-xl p-4 relative z-50">
                    <div className="items-center justify-between font-medium w-full">
                        <ul ref={categoryListRef} className="flex space-x-8 rtl:space-x-reverse">
                            {loading ? (
                                Array(10).fill().map((_, index) => (
                                    <li key={index} className="relative">
                                        <Skeleton variant="text" animation="wave" width={100} height={40} />
                                    </li>
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
                                            onClick={() => handleNavigation(`/products/category/${category._id}`, category._id)}
                                        >
                                            {category.name}
                                        </button>
                                        {openCategory === category._id && subcategories[category._id]?.length > 0 && (
                                            <div
                                                className="fixed bg-white shadow-xl rounded-lg p-4 z-50"
                                                style={calculateDropdownStyle()}
                                            >
                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                                                    {subcategories[category._id].map((subcategory) => (
                                                        <div key={subcategory._id} className="flex items-left">
                                                            <img
                                                                src={getImageUrl(subcategory.image)}
                                                                alt=""
                                                                width={50}
                                                                height={50}
                                                                className="rounded-md object-contain mr-2"
                                                            />
                                                            <div>
                                                                <button
                                                                    onClick={() => handleNavigation(`/products/subcategory/${subcategory._id}`, category._id)}
                                                                    className="block py-2 px-2 mr-1 rounded text-gray-700 hover:bg-gray-100 font-semibold"
                                                                >
                                                                    {subcategory.name}
                                                                </button>
                                                                {subsubcategories[subcategory._id]?.length > 0 && (
                                                                    <div className="flex flex-wrap lg:flex-wrap text-start lg:text-left">
                                                                        {subsubcategories[subcategory._id].map((subsubcategory) => (
                                                                            <div key={subsubcategory._id} className='text-start'>
                                                                                <button
                                                                                    onClick={() => handleNavigation(`/products/subSubcategory/${subsubcategory._id}`, category._id)}
                                                                                    className="block py-1 px-2 ml-1 rounded text-gray-500 hover:bg-gray-100"
                                                                                >
                                                                                    {subsubcategory.name}
                                                                                </button>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Mobile screens */}
            <div {...handlers} className={`fixed top-0 left-0 w-80 h-full bg-white z-[1000] transition-transform transform duration-500 ease-in-out overflow-y-auto ${isSidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
                <div className="p-2 border-b flex flex-col items-start">
                    <div className='-mx-0 h-12 bg-stone-500 flex items-center justify-start w-full rounded-md mb-2 !p-0'>
                        <h1 className="text-white font-bold text-lg pl-3">sheero</h1>
                    </div>

                    <button
                        onClick={() => navigate('/')}
                        className='flex items-center rounded w-full text-left mb-2'
                    >
                        <HomeIcon color='primary' />
                        Home
                    </button>

                    <button
                        onClick={() => navigate('/cart')}
                        className='flex items-center rounded w-full text-left mb-2'
                    >
                        <CartIcon color='primary' />
                        Cart
                    </button>

                    <button
                        onClick={() => navigate('/profile/wishlist')}
                        className='flex items-center rounded w-full text-left'
                    >
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
                        categories.map((category) => (
                            <li key={category._id} className="mb-4">
                                <div className="flex items-center justify-between">
                                    <div className='border-t bg-gray-50' />
                                    <img
                                        src={getImageUrl(category.image)}
                                        alt=""
                                        width={30}
                                        className="rounded-md"
                                    />
                                    <button
                                        onClick={() => handleNavigation(`/products/category/${category._id}`, category._id)}
                                        className={`flex-grow text-left p-2 ${activeCategory === category._id ? 'bg-gray-100' : ''}`}
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
                                                        width={30}
                                                        className="rounded-md"
                                                    />
                                                    <button
                                                        onClick={() => handleNavigation(`/products/subcategory/${subcategory._id}`, category._id)}
                                                        className="block py-1 px-2 text-gray-700 hover:bg-gray-100"
                                                    >
                                                        {subcategory.name}
                                                    </button>
                                                </div>
                                                {subsubcategories[subcategory._id]?.length > 0 && (
                                                    <ul className="pl-4">
                                                        {subsubcategories[subcategory._id].map((subsubcategory) => (
                                                            <li key={subsubcategory._id} className="flex items-center">
                                                                <div className="rounded-md mr-9" />
                                                                <button
                                                                    onClick={() => handleNavigation(`/products/subSubcategory/${subsubcategory._id}`, category._id)}
                                                                    className="block py-1 text-gray-500 hover:bg-gray-100"
                                                                >
                                                                    {subsubcategory.name}
                                                                </button>
                                                            </li>
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
                        className="text-sm ml-7 no-underline"
                        onClick={() => navigate('/faqs')}
                    >
                        Frequently Asked Questions
                    </span>
                    <span className="text-sm ml-7">Contact us:</span>
                    <span className="text-sm ml-7">Email: support@sheero.com</span>
                    <span className="text-sm ml-7 mb-10">Tel.: 044888999</span>
                </div>
            </div>
        </>
    );
};

export default CategoryNavbar;