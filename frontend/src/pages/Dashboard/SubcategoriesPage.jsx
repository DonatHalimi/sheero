import { Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { ActionButton, BrownCreateOutlinedIcon, OutlinedBrownButton } from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import AddSubcategoryModal from '../../components/Modal/Subcategory/AddSubcategoryModal';
import DeleteSubcategoryModal from '../../components/Modal/Subcategory/DeleteSubcategoryModal';
import EditSubcategoryModal from '../../components/Modal/Subcategory/EditSubcategoryModal';
import { AuthContext } from '../../context/AuthContext';

const SubcategoriesPage = () => {
    const [subcategories, setSubcategories] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);
    const [addSubcategoryOpen, setAddSubcategoryOpen] = useState(false);
    const [editSubcategoryOpen, setEditSubcategoryOpen] = useState(false);
    const [deleteSubcategoryOpen, setDeleteSubcategoryOpen] = useState(false);
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
        setSelectedSubcategories((prevSelected) => {
            if (prevSelected.includes(subcategoryId)) {
                return prevSelected.filter(id => id !== subcategoryId);
            } else {
                return [...prevSelected, subcategoryId];
            }
        });
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

    const columns = [
        { label: 'checkbox', key: 'checkbox' },
        { label: 'Name', key: 'name' },
        { label: 'Image', key: 'image', render: (item) => <img className='rounded-md' src={`http://localhost:5000/${item.image}`} alt="" width={80} /> },
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
        <>
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
                <DeleteSubcategoryModal open={deleteSubcategoryOpen} onClose={() => setDeleteSubcategoryOpen(false)} subcategories={selectedSubcategories.map(id => subcategories.find(subcategory => subcategory._id === id))} onDeleteSuccess={fetchSubcategories} />
            </div>
        </>
    );
};

export default SubcategoriesPage;