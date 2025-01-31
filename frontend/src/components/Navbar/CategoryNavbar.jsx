import { Divider, Skeleton } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { CategoryDropdown, CategoryList, SidebarFooter, SidebarHeader } from '../../assets/CustomComponents';
import { getSubcategoriesAndSubsubcategories } from '../../store/actions/categoryActions';

const CategoryNavbar = ({ isSidebarOpen, toggleSidebar }) => {
    const { categories, subcategories, subsubcategories, loading } = useSelector((state) => state.categories);
    const { isAuthenticated } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const [openCategory, setOpenCategory] = useState(null);
    const [activeCategory, setActiveCategory] = useState('');
    const [dropdownLoading, setDropdownLoading] = useState(true);

    const categoryListRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const handleCategoryHover = (categoryId) => {
        setOpenCategory(categoryId);

        const categoryData = subcategories[categoryId];
        if (!categoryData) {
            setDropdownLoading(true);
            dispatch(getSubcategoriesAndSubsubcategories(categoryId))
                .finally(() => setDropdownLoading(false));
        } else {
            setDropdownLoading(false);
        }
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
                                    <Skeleton key={index} variant="text" animation="wave" width={100} height={40} />
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
            <div
                {...handlers}
                onClick={(e) => e.stopPropagation()}
                className={`fixed top-0 left-0 w-80 h-full bg-white z-[1000] transition-transform transform duration-500 ease-in-out overflow-y-auto ${isSidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}
            >
                <SidebarHeader navigate={navigate} isAuthenticated={isAuthenticated} />

                <CategoryList
                    loading={loading}
                    categories={categories}
                    subcategories={subcategories}
                    subsubcategories={subsubcategories}
                    activeCategory={activeCategory}
                    openCategory={openCategory}
                    toggleSubcategories={toggleSubcategories}
                    handleNavigation={handleNavigation}
                />

                <Divider className='!mb-5' />

                <SidebarFooter />
            </div >
        </>
    );
};

export default CategoryNavbar;