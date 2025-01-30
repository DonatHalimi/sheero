import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeader, exportOptions, LoadingDataGrid } from '../../assets/CustomComponents';
import { exportToExcel, exportToJSON } from '../../assets/DataExport';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal';
import AddSubSubcategoryModal from '../../components/Modal/SubSubcategory/AddSubSubcategoryModal';
import EditSubSubcategoryModal from '../../components/Modal/SubSubcategory/EditSubSubcategoryModal';
import SubSubcategoryDetailsDrawer from '../../components/Modal/SubSubcategory/SubSubcategoryDetailsDrawer';
import { getSubSubcategories } from '../../store/actions/dashboardActions';

const SubSubcategoriesPage = () => {
    const { subSubcategories, loadingSubSubcategories } = useSelector((state) => state.dashboard);
    const dispatch = useDispatch();

    const [selectedSubSubcategory, setSelectedSubSubcategory] = useState(null);
    const [selectedSubSubcategories, setSelectedSubSubcategories] = useState([]);
    const [addSubSubcategoryOpen, setAddSubSubcategoryOpen] = useState(false);
    const [editSubSubcategoryOpen, setEditSubSubcategoryOpen] = useState(false);
    const [deleteSubSubcategoryOpen, setDeleteSubSubcategoryOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(getSubSubcategories());
    }, [dispatch]);

    useEffect(() => {
        const handleKeydown = (e) => {
            if (e.altKey && e.key === 'a') {
                setAddSubSubcategoryOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeydown);
        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    }, [subSubcategories]);

    const handleSelectSubSubcategory = (subsubcategoryId) => {
        const id = Array.isArray(subsubcategoryId) ? subsubcategoryId[0] : subsubcategoryId;

        setSelectedSubSubcategories((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((selectedId) => selectedId !== id)
                : [...prevSelected, id]
        );
    };

    const handleSelectAll = (e) => {
        setSelectedSubSubcategories(e.target.checked ? subSubcategories.map(subSubcategory => subSubcategory._id) : []);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleEdit = (subSubcategory) => {
        setSelectedSubSubcategory(subSubcategory);
        setEditSubSubcategoryOpen(true);
    };

    const handleEditFromDrawer = (subSubcategory) => {
        setViewDetailsOpen(false);
        setSelectedSubSubcategory(subSubcategory);
        setEditSubSubcategoryOpen(true);
    };

    const getSelectedSubSubcategories = () => {
        return selectedSubSubcategories
            .map((id) => subSubcategories.find((subSubcategory) => subSubcategory._id === id))
            .filter((subSubcategory) => subSubcategory);
    };

    const handleDeleteSuccess = () => {
        dispatch(getSubSubcategories());
        setSelectedSubSubcategories([]);
    };

    const handleViewDetails = (subSubcategory) => {
        setSelectedSubSubcategory(subSubcategory);
        setViewDetailsOpen(true);
    };

    const closeDrawer = () => {
        setViewDetailsOpen(false);
        setSelectedSubSubcategory(null);
    };

    const columns = [
        { label: 'Name', key: 'name' },
        { label: 'Subcategory', key: 'subcategory.name' },
        { label: 'Actions', key: 'actions' }
    ];

    const handleExport = (data, format) => {
        const flattenedSubSubcategories = data.map(subSubcategory => ({
            ...subSubcategory,
            subcategory: subSubcategory.subcategory ? subSubcategory.subcategory.name : 'N/A',
        }))

        format === 'excel' ? exportToExcel(flattenedSubSubcategories, 'subSubcategories_data') : exportToJSON(data, 'subSubcategories_data');
    }

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                {loadingSubSubcategories ? (
                    <LoadingDataGrid />
                ) : (
                    <>
                        <DashboardHeader
                            title="SubSubcategories"
                            selectedItems={selectedSubSubcategories}
                            setAddItemOpen={setAddSubSubcategoryOpen}
                            setDeleteItemOpen={setDeleteSubSubcategoryOpen}
                            itemName="SubSubcategory"
                            exportOptions={exportOptions(subSubcategories, handleExport)}
                        />

                        <DashboardTable
                            columns={columns}
                            data={subSubcategories}
                            selectedItems={selectedSubSubcategories}
                            onSelectItem={handleSelectSubSubcategory}
                            onSelectAll={handleSelectAll}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageClick}
                            onEdit={handleEdit}
                            onViewDetails={handleViewDetails}
                        />
                    </>
                )}

                <AddSubSubcategoryModal open={addSubSubcategoryOpen} onClose={() => setAddSubSubcategoryOpen(false)} onAddSuccess={() => dispatch(getSubSubcategories())} />
                <EditSubSubcategoryModal open={editSubSubcategoryOpen} onClose={() => setEditSubSubcategoryOpen(false)} subSubcategory={selectedSubSubcategory} onViewDetails={handleViewDetails} onEditSuccess={() => dispatch(getSubSubcategories())} />
                <SubSubcategoryDetailsDrawer open={viewDetailsOpen} onClose={closeDrawer} subSubcategory={selectedSubSubcategory} onEdit={handleEditFromDrawer} />
                <DeleteModal
                    open={deleteSubSubcategoryOpen}
                    onClose={() => setDeleteSubSubcategoryOpen(false)}
                    items={getSelectedSubSubcategories()}
                    onDeleteSuccess={handleDeleteSuccess}
                    endpoint="/subsubcategories/delete-bulk"
                    title="Delete SubSubcategories"
                    message="Are you sure you want to delete the selected subsubcategories?"
                />
            </div>
        </div>
    );
};

export default SubSubcategoriesPage;