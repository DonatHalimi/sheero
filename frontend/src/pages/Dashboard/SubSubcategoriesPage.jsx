import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeader, LoadingDataGrid } from '../../assets/CustomComponents';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal';
import AddSubSubcategoryModal from '../../components/Modal/SubSubcategory/AddSubSubcategoryModal';
import EditSubSubcategoryModal from '../../components/Modal/SubSubcategory/EditSubSubcategoryModal';
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
    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(getSubSubcategories());
    }, [dispatch]);

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

    const columns = [
        { label: 'Name', key: 'name' },
        { label: 'Subcategory', key: 'subcategory.name' },
        { label: 'Actions', key: 'actions' }
    ];

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
                        />
                    </>
                )}

                <AddSubSubcategoryModal open={addSubSubcategoryOpen} onClose={() => setAddSubSubcategoryOpen(false)} onAddSuccess={() => dispatch(getSubSubcategories())} />
                <EditSubSubcategoryModal open={editSubSubcategoryOpen} onClose={() => setEditSubSubcategoryOpen(false)} subSubcategory={selectedSubSubcategory} onEditSuccess={() => dispatch(getSubSubcategories())} />
                <DeleteModal
                    open={deleteSubSubcategoryOpen}
                    onClose={() => setDeleteSubSubcategoryOpen(false)}
                    items={selectedSubSubcategories.map(id => subSubcategories.find(subsubcategory => subsubcategory._id === id)).filter(subsubcategory => subsubcategory)}
                    onDeleteSuccess={() => {
                        dispatch(getSubSubcategories())
                        setSelectedSubSubcategories([])
                    }}
                    endpoint="/subsubcategories/delete-bulk"
                    title="Delete SubSubcategories"
                    message="Are you sure you want to delete the selected subsubcategories?"
                />
            </div>
        </div>
    );
};

export default SubSubcategoriesPage;