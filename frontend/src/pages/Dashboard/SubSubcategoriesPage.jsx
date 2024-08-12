import { Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { ActionButton, BrownCreateOutlinedIcon, OutlinedBrownButton } from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import AddSubSubcategoryModal from '../../components/Modal/SubSubcategory/AddSubSubcategoryModal';
import DeleteSubSubcategoryModal from '../../components/Modal/SubSubcategory/DeleteSubSubcategoryModal';
import EditSubSubcategoryModal from '../../components/Modal/SubSubcategory/EditSubSubcategoryModal';
import { AuthContext } from '../../context/AuthContext';

const SubSubcategoriesPage = () => {
    const [subSubcategories, setSubSubcategories] = useState([]);
    const [selectedSubSubcategory, setSelectedSubSubcategory] = useState(null);
    const [selectedSubSubcategories, setSelectedSubSubcategories] = useState([]);
    const [addSubSubcategoryOpen, setAddSubSubcategoryOpen] = useState(false);
    const [editSubSubcategoryOpen, setEditSubSubcategoryOpen] = useState(false);
    const [deleteSubSubcategoryOpen, setDeleteSubSubcategoryOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        fetchSubSubcategories();
    }, [addSubSubcategoryOpen, editSubSubcategoryOpen, deleteSubSubcategoryOpen, axiosInstance]);

    const fetchSubSubcategories = async () => {
        try {
            const response = await axiosInstance.get('/subsubcategories/get');
            setSubSubcategories(response.data);
        } catch (error) {
            console.error('Error fetching subsubcategories', error);
        }
    };

    const handleSelectSubSubcategory = (subSubcategoryId) => {
        setSelectedSubSubcategories((prevSelected) =>
            prevSelected.includes(subSubcategoryId)
                ? prevSelected.filter(id => id !== subSubcategoryId)
                : [...prevSelected, subSubcategoryId]
        );
    };

    const handleSelectAll = (e) => {
        setSelectedSubSubcategories(e.target.checked ? subSubcategories.map(subSubcategory => subSubcategory._id) : []);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const columns = [
        { key: 'checkbox', label: 'checkbox' },
        { key: 'name', label: 'Name' },
        { key: 'subcategory.name', label: 'Subcategory' },
        { key: 'actions', label: 'Actions' }
    ];

    const renderActionButtons = (subSubcategory) => (
        <ActionButton onClick={() => { setSelectedSubSubcategory(subSubcategory); setEditSubSubcategoryOpen(true); }}>
            <BrownCreateOutlinedIcon />
        </ActionButton>
    );

    const renderTableActions = () => (
        <div className='flex items-center justify-between w-full mb-4'>
            <Typography variant='h5'>SubSubcategories</Typography>
            <div>
                <OutlinedBrownButton onClick={() => setAddSubSubcategoryOpen(true)} className='!mr-4'>
                    Add SubSubcategory
                </OutlinedBrownButton>
                {selectedSubSubcategories.length > 0 && (
                    <OutlinedBrownButton
                        onClick={() => setDeleteSubSubcategoryOpen(true)}
                        disabled={selectedSubSubcategories.length === 0}
                    >
                        {selectedSubSubcategories.length > 1 ? 'Delete Selected SubSubcategories' : 'Delete SubSubcategory'}
                    </OutlinedBrownButton>
                )}
            </div>
        </div>
    );

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                <DashboardTable
                    columns={columns}
                    data={subSubcategories}
                    selectedItems={selectedSubSubcategories}
                    onSelectItem={handleSelectSubSubcategory}
                    onSelectAll={handleSelectAll}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageClick}
                    renderActionButtons={renderActionButtons}
                    renderTableActions={renderTableActions}
                />

                <AddSubSubcategoryModal open={addSubSubcategoryOpen} onClose={() => setAddSubSubcategoryOpen(false)} onAddSuccess={fetchSubSubcategories} />
                <EditSubSubcategoryModal open={editSubSubcategoryOpen} onClose={() => setEditSubSubcategoryOpen(false)} subSubcategory={selectedSubSubcategory} onEditSuccess={fetchSubSubcategories} />
                <DeleteSubSubcategoryModal open={deleteSubSubcategoryOpen} onClose={() => setDeleteSubSubcategoryOpen(false)} subSubcategories={selectedSubSubcategories.map(id => subSubcategories.find(subSubcategory => subSubcategory._id === id))} onDeleteSuccess={fetchSubSubcategories} />
            </div>
        </div>
    );
};

export default SubSubcategoriesPage;