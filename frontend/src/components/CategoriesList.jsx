import React, { useEffect, useRef, useState } from 'react';
import useAxios from '../axiosInstance';

const CategoriesList = () => {
    const axiosInstance = useAxios();
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState({});
    const [subsubcategories, setSubsubcategories] = useState({});
    const [openCategory, setOpenCategory] = useState(null);
    const megaMenuRef = useRef(null);
    const categoryListRef = useRef(null);

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
            const response = await axiosInstance.get(`/subcategories/getByCategory/${categoryId}`);
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
            const response = await axiosInstance.get(`/subsubcategories/getBySubcategory/${subcategoryId}`);
            setSubsubcategories((prev) => ({ ...prev, [subcategoryId]: response.data }));
        } catch (error) {
            console.error('Error fetching subsubcategories:', error);
        }
    };

    const handleCategoryHover = (categoryId) => {
        setOpenCategory(categoryId);
        if (!subcategories[categoryId]) {
            fetchSubcategories(categoryId);
        }
    };

    const handleCategoryLeave = () => {
        setOpenCategory(null);
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

    return (
        <nav className="bg-white dark:border-gray-100 border-t shadow-md border-gray-100">
            <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
                <button
                    data-collapse-toggle="mega-menu-full"
                    type="button"
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-stone-400 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    aria-controls="mega-menu-full"
                    aria-expanded="false"
                >
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>
                <div id="mega-menu-full" className="items-center justify-between font-medium hidden w-full md:flex md:w-auto md:order-1" ref={megaMenuRef}>
                    <ul ref={categoryListRef} className="flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 bg-white border-b-2">
                        {categories.map((category) => (
                            <li
                                key={category._id}
                                onMouseEnter={() => handleCategoryHover(category._id)}
                                onMouseLeave={handleCategoryLeave}
                                className="relative"
                            >
                                <button
                                    id="mega-menu-full-dropdown-button"
                                    data-collapse-toggle="mega-menu-full-dropdown"
                                    className="flex items-center justify-between w-full py-2 px-3 text-gray-900 rounded md:w-auto hover:bg-stone-400 md:hover:bg-transparent md:border-0 md:hover:text-stone-600 md:p-0 dark:text-black md:dark:hover:text-stone-500"
                                >
                                    {category.name}
                                </button>
                                {openCategory === category._id && subcategories[category._id] && (
                                    <div
                                        className="fixed bg-white shadow-lg rounded-lg p-4 z-50"
                                        style={{ ...calculateDropdownStyle() }}
                                    >
                                        <ul>
                                            {subcategories[category._id].map((subcategory) => (
                                                <li key={subcategory._id} className="mb-2 flex items-center">
                                                    <img className='rounded-md' src={`http://localhost:5000/${subcategory.image}`} alt="" width={50} />
                                                    <div className="">
                                                        <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 font-semibold">
                                                            {subcategory.name}
                                                        </a>
                                                        {subsubcategories[subcategory._id] && (
                                                            <ul className="pl-4">
                                                                {subsubcategories[subcategory._id].map((subsubcategory) => (
                                                                    <li key={subsubcategory._id}>
                                                                        <a href="#" className="block py-1 px-2 text-gray-500 hover:bg-gray-100">
                                                                            {subsubcategory.name}
                                                                        </a>
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
    );
};

export default CategoriesList;
