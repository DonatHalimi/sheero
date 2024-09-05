import { Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { ActionButton, BrownCreateOutlinedIcon, OutlinedBrownButton } from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal';
import ImagePreviewModal from '../../components/Modal/ImagePreviewModal';
import AddSubcategoryModal from '../../components/Modal/Subcategory/AddSubcategoryModal';
import EditSubcategoryModal from '../../components/Modal/Subcategory/EditSubcategoryModal';
import { AuthContext } from '../../context/AuthContext';

const SubcategoriesPage = () => {
    const [subcategories, setSubcategories] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);
    const [addSubcategoryOpen, setAddSubcategoryOpen] = useState(false);
    const [editSubcategoryOpen, setEditSubcategoryOpen] = useState(false);
    const [deleteSubcategoryOpen, setDeleteSubcategoryOpen] = useState(false);
    const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        fetchSubcategories();
    }, [addSubcategoryOpen, editSubcategoryOpen, deleteSubcategoryOpen, axiosInstance]);

    const fetchSubcategories = async () => {
        try {
            const response = await axiosInstance.get('/subcategories/get');
            setSubcategories(response.data);
        } catch (error) {
            console.error('Error fetching subcategories', error);
        }
    };

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

    const columns = [
        { label: 'Name', key: 'name' },
        {
            key: 'image',
            label: 'Image',
            render: (item) => (
                <img
                    className='rounded-md cursor-pointer'
                    src={`http://localhost:5000/${item.image}`}
                    alt=""
                    width={70}
                    style={{ position: 'relative', top: '3px' }}
                    onClick={() => handleImageClick(`http://localhost:5000/${item.image}`)}
                />
            )
        },
        { label: 'Category', key: 'category.name' },
        { label: 'Actions', key: 'actions' }
    ];

    const renderActionButtons = (item) => (
        <ActionButton onClick={() => { setSelectedSubcategory(item); setEditSubcategoryOpen(true); }}>
            <BrownCreateOutlinedIcon />
        </ActionButton>
    );

    const renderTableActions = () => (
        <div className='flex items-center justify-between w-full mb-4'>
            <Typography variant='h5'>Subcategories</Typography>
            <div>
                <OutlinedBrownButton onClick={() => setAddSubcategoryOpen(true)} className='!mr-4'>
                    Add Subcategory
                </OutlinedBrownButton>
                {selectedSubcategories.length > 0 && (
                    <OutlinedBrownButton
                        onClick={() => setDeleteSubcategoryOpen(true)}
                        disabled={selectedSubcategories.length === 0}
                    >
                        {selectedSubcategories.length > 1 ? 'Delete Selected Subcategories' : 'Delete Subcategory'}
                    </OutlinedBrownButton>
                )}
            </div>
        </div>
    );

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
                <DashboardTable
                    columns={columns}
                    data={subcategories}
                    selectedItems={selectedSubcategories}
                    onSelectItem={handleSelectSubcategory}
                    onSelectAll={handleSelectAll}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageClick}
                    renderActionButtons={renderActionButtons}
                    renderTableActions={renderTableActions}
                    containerClassName="max-w-screen-2xl mx-auto"
                />
                <AddSubcategoryModal open={addSubcategoryOpen} onClose={() => setAddSubcategoryOpen(false)} onAddSuccess={fetchSubcategories} />
                <EditSubcategoryModal open={editSubcategoryOpen} onClose={() => setEditSubcategoryOpen(false)} subcategory={selectedSubcategory} onEditSuccess={fetchSubcategories} />
                <DeleteModal
                    open={deleteSubcategoryOpen}
                    onClose={() => setDeleteSubcategoryOpen(false)}
                    items={selectedSubcategories.map(id => subcategories.find(subcategory => subcategory._id === id)).filter(subcategory => subcategory)}
                    onDeleteSuccess={fetchSubcategories}
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