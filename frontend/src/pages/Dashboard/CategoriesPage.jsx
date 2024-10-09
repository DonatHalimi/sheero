import React, { useContext, useEffect, useState } from 'react';
import { DashboardHeader } from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import AddCategoryModal from '../../components/Modal/Category/AddCategoryModal';
import EditCategoryModal from '../../components/Modal/Category/EditCategoryModal';
import DeleteModal from '../../components/Modal/DeleteModal';
import ImagePreviewModal from '../../components/Modal/ImagePreviewModal';
import { AuthContext } from '../../context/AuthContext';
import { getImageUrl } from '../../config';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [addCategoryOpen, setAddCategoryOpen] = useState(false);
    const [editCategoryOpen, setEditCategoryOpen] = useState(false);
    const [deleteCategoryOpen, setDeleteCategoryOpen] = useState(false);
    const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        fetchCategories();
    }, [addCategoryOpen, editCategoryOpen, deleteCategoryOpen, axiosInstance]);

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get('/categories/get');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories', error);
        }
    };

    const handleSelectCategory = (categoryId) => {
        const id = Array.isArray(categoryId) ? categoryId[0] : categoryId;

        setSelectedCategories((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((selectedId) => selectedId !== id)
                : [...prevSelected, id]
        );
    };

    const handleSelectAll = (e) => {
        setSelectedCategories(e.target.checked ? categories.map(category => category._id) : []);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleImageClick = (imageUrl) => {
        setSelectedCategory(imageUrl);
        setImagePreviewOpen(true);
    };

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setEditCategoryOpen(true);
    };

    const columns = [
        { key: 'name', label: 'Name' },
        {
            key: 'image',
            label: 'Image',
            render: (item) => (
                <img
                    className='rounded-md cursor-pointer'
                    src={getImageUrl(`/${item.image}`)}
                    alt=""
                    width={70}
                    style={{ position: 'relative', top: '3px' }}
                    onClick={() => handleImageClick(getImageUrl(`/${item.image}`))}
                />
            )
        },
        { key: 'actions', label: 'Actions' }
    ];

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                <DashboardHeader
                    title="Categories"
                    selectedItems={selectedCategories}
                    setAddItemOpen={setAddCategoryOpen}
                    setDeleteItemOpen={setDeleteCategoryOpen}
                    itemName="Category"
                />

                <DashboardTable
                    columns={columns}
                    data={categories}
                    selectedItems={selectedCategories}
                    onSelectItem={handleSelectCategory}
                    onSelectAll={handleSelectAll}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageClick}
                    onEdit={handleEdit}
                />

                <AddCategoryModal open={addCategoryOpen} onClose={() => setAddCategoryOpen(false)} onAddSuccess={fetchCategories} />
                <EditCategoryModal open={editCategoryOpen} onClose={() => setEditCategoryOpen(false)} category={selectedCategory} onEditSuccess={fetchCategories} />
                <DeleteModal
                    open={deleteCategoryOpen}
                    onClose={() => setDeleteCategoryOpen(false)}
                    items={selectedCategories.map(id => categories.find(category => category._id === id)).filter(category => category)}
                    onDeleteSuccess={fetchCategories}
                    endpoint="/categories/delete-bulk"
                    title="Delete Categories"
                    message="Are you sure you want to delete the selected categories?"
                />
                <ImagePreviewModal open={imagePreviewOpen} onClose={() => setImagePreviewOpen(false)} imageUrl={selectedCategory} />
            </div>
        </div>
    );
};

export default CategoriesPage;
