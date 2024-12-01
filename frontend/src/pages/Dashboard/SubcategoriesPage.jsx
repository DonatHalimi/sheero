import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeader } from '../../assets/CustomComponents';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal';
import ImagePreviewModal from '../../components/Modal/ImagePreviewModal';
import AddSubcategoryModal from '../../components/Modal/Subcategory/AddSubcategoryModal';
import EditSubcategoryModal from '../../components/Modal/Subcategory/EditSubcategoryModal';
import { getImageUrl } from '../../config';
import { getSubcategories } from '../../store/actions/dashboardActions';

const SubcategoriesPage = () => {
    const { subcategories } = useSelector((state) => state.dashboard);
    const dispatch = useDispatch();

    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);
    const [addSubcategoryOpen, setAddSubcategoryOpen] = useState(false);
    const [editSubcategoryOpen, setEditSubcategoryOpen] = useState(false);
    const [deleteSubcategoryOpen, setDeleteSubcategoryOpen] = useState(false);
    const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(getSubcategories());
    }, [dispatch]);

    const handleSelectSubcategory = (subcategoryId) => {
        const id = Array.isArray(subcategoryId) ? subcategoryId[0] : subcategoryId;

        setSelectedSubcategories((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((selectedId) => selectedId !== id)
                : [...prevSelected, id]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedSubcategories(subcategories.map(subcategory => subcategory._id));
        } else {
            setSelectedSubcategories([]);
        }
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleImageClick = (imageUrl) => {
        setSelectedSubcategory(imageUrl);
        setImagePreviewOpen(true);
    };

    const handleEdit = (subcategory) => {
        setSelectedSubcategory(subcategory);
        setEditSubcategoryOpen(true);
    };

    const columns = [
        { label: 'Name', key: 'name' },
        {
            key: 'image',
            label: 'Image',
            render: (item) => (
                <img
                    className='rounded-md cursor-pointer'
                    src={getImageUrl(item.image)}
                    alt=""
                    width={70}
                    style={{ position: 'relative', top: '3px' }}
                    onClick={() => handleImageClick(getImageUrl(item.image))}
                />
            )
        },
        { label: 'Category', key: 'category.name' },
        { label: 'Actions', key: 'actions' }
    ];

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
                <DashboardHeader
                    title="Subcategories"
                    selectedItems={selectedSubcategories}
                    setAddItemOpen={setAddSubcategoryOpen}
                    setDeleteItemOpen={setDeleteSubcategoryOpen}
                    itemName="Subcategory"
                />

                <DashboardTable
                    columns={columns}
                    data={subcategories}
                    selectedItems={selectedSubcategories}
                    onSelectItem={handleSelectSubcategory}
                    onSelectAll={handleSelectAll}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageClick}
                    onEdit={handleEdit}
                    containerClassName="max-w-screen-2xl mx-auto"
                />
                <AddSubcategoryModal open={addSubcategoryOpen} onClose={() => setAddSubcategoryOpen(false)} onAddSuccess={() => dispatch(getSubcategories())} />
                <EditSubcategoryModal open={editSubcategoryOpen} onClose={() => setEditSubcategoryOpen(false)} subcategory={selectedSubcategory} onEditSuccess={() => dispatch(getSubcategories())} />
                <DeleteModal
                    open={deleteSubcategoryOpen}
                    onClose={() => setDeleteSubcategoryOpen(false)}
                    items={selectedSubcategories.map(id => subcategories.find(subcategory => subcategory._id === id)).filter(subcategory => subcategory)}
                    onDeleteSuccess={() => dispatch(getSubcategories())}
                    endpoint="/subcategories/delete-bulk"
                    title="Delete Subcategories"
                    message="Are you sure you want to delete the selected subcategories?"
                />
                <ImagePreviewModal open={imagePreviewOpen} onClose={() => setImagePreviewOpen(false)} imageUrl={selectedSubcategory} />
            </div>
        </div>
    );
};

export default SubcategoriesPage;