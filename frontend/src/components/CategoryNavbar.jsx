import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxios from '../axiosInstance';

const CategoryNavbar = ({ children }) => {
    const axiosInstance = useAxios();
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState({});
    const [subsubcategories, setSubsubcategories] = useState({});
    const [openCategory, setOpenCategory] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [darkOverlay, setDarkOverlay] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);

    const megaMenuRef = useRef(null);
    const categoryListRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('/categories/get');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, [axiosInstance]);

    const fetchSubcategories = async (categoryId) => {
        try {
            const response = await axiosInstance.get(`/subcategories/get-by-category/${categoryId}`);
            setSubcategories((prev) => ({ ...prev, [categoryId]: response.data }));

            response.data.forEach(subcategory => {
                fetchSubsubcategories(subcategory._id);
            });
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        }
    };

    const fetchSubsubcategories = async (subcategoryId) => {
        try {
            const response = await axiosInstance.get(`/subsubcategories/get-by-subCategory/${subcategoryId}`);
            setSubsubcategories((prev) => ({ ...prev, [subcategoryId]: response.data }));
        } catch (error) {
            console.error('Error fetching subsubcategories:', error);
        }
    };

    const handleCategoryHover = (categoryId) => {
        setOpenCategory(categoryId);
        setDarkOverlay(true);
        if (!subcategories[categoryId]) {
            fetchSubcategories(categoryId);
        }
    };

    const handleCategoryLeave = () => {
        setOpenCategory(null);
        setDarkOverlay(false);
    };

    const calculateDropdownStyle = () => {
        if (categoryListRef.current) {
            const { width, left, bottom } = categoryListRef.current.getBoundingClientRect();
            return {
                width: `${width}px`,
                left: `${left}px`,
                top: `${bottom}px`,
            };
        }
        return {};
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleCategoryClick = (categoryId) => {
        setActiveCategory(categoryId);
        navigate(`/products/category/${categoryId}`);
        setTimeout(() => {
            document.getElementById('product-container')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleSubcategoryClick = (subcategoryId, categoryId) => {
        setActiveCategory(categoryId);
        navigate(`/products/subcategory/${subcategoryId}`);
        setTimeout(() => {
            document.getElementById('product-container')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleSubSubcategoryClick = (subsubcategoryId, categoryId) => {
        setActiveCategory(categoryId);
        navigate(`/products/subSubcategory/${subsubcategoryId}`);
        setTimeout(() => {
            document.getElementById('product-container')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    return (
        <>
            <nav className="bg-white shadow-sm border border-t border-gray-50 relative z-50">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4 relative z-50">
                    <button
                        data-collapse-toggle="mega-menu-full"
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-stone-500 rounded-lg md:hidden hover:bg-stone-400 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-stone-700 dark:focus:ring-gray-600 ml-auto"
                        aria-controls="mega-menu-full"
                        aria-expanded={menuOpen}
                        onClick={toggleMenu}
                    >
                        <span className="sr-only">Open main menu</span>
                        {menuOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>
                    <div id="mega-menu-full" className={`items-center justify-between font-medium ${menuOpen ? 'block' : 'hidden'} w-full md:flex md:w-auto md:order-1`} ref={megaMenuRef}>
                        <ul ref={categoryListRef} className="flex flex-col p-4 md:p-0 mt-4 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 bg-white">
                            {categories.map((category) => (
                                <li
                                    key={category._id}
                                    onMouseEnter={() => handleCategoryHover(category._id)}
                                    onMouseLeave={handleCategoryLeave}
                                    className="relative"
                                >
                                    <button
                                        onClick={() => handleCategoryClick(category._id)}
                                        className={`flex items-center justify-between w-full py-2 px-3 text-gray-900 rounded md:w-auto md:border-0 md:p-0 ${activeCategory === category._id ? 'bg-gray-200 p-10' : 'hover:bg-stone-400 md:hover:bg-transparent md:hover:text-stone-600'}`}
                                    >
                                        {category.name}
                                    </button>
                                    {openCategory === category._id && subcategories[category._id] && subcategories[category._id].length > 0 && (
                                        <div
                                            className="fixed bg-white shadow-lg rounded-lg p-4 z-50"
                                            style={{ ...calculateDropdownStyle() }}
                                        >
                                            <ul>
                                                {subcategories[category._id].map((subcategory) => (
                                                    <li key={subcategory._id} className="mb-2 flex items-center">
                                                        <img className='rounded-md' src={`http://localhost:5000/${subcategory.image}`} alt="" width={50} />
                                                        <div className="">
                                                            <button
                                                                onClick={() => handleSubcategoryClick(subcategory._id, category._id)}
                                                                className="block py-2 px-4 ml-2 text-gray-700 hover:bg-gray-100 font-semibold"
                                                            >
                                                                {subcategory.name}
                                                            </button>
                                                            {subsubcategories[subcategory._id] && subsubcategories[subcategory._id].length > 0 && (
                                                                <ul className="pl-4">
                                                                    {subsubcategories[subcategory._id].map((subsubcategory) => (
                                                                        <li key={subsubcategory._id}>
                                                                            <button
                                                                                onClick={() => handleSubSubcategoryClick(subsubcategory._id, category._id)}
                                                                                className="block py-1 px-2 ml-2 text-gray-500 hover:bg-gray-100"
                                                                            >
                                                                                {subsubcategory.name}
                                                                            </button>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="relative">
                {darkOverlay && (
                    <div className="fixed inset-0 top-[110px] bg-black opacity-50 z-40"></div>
                )}
                <div className="relative z-50">
                    {children}
                </div>
            </div>
        </>
    );
};

export default CategoryNavbar;