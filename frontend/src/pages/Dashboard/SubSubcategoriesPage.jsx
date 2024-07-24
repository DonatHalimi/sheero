import { Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useAxios from '../../axiosInstance';
import { ActionButton, BoldTableCell, BrownCreateOutlinedIcon, OutlinedBrownButton } from '../../components/Dashboard/CustomComponents';
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
    const [fetchErrorCount, setFetchErrorCount] = useState(0);

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        const fetchSubSubcategories = async () => {
            try {
                const response = await axiosInstance.get('/subsubcategories/get');
                setSubSubcategories(response.data);
                setFetchErrorCount(0);
            } catch (error) {
                setFetchErrorCount(prevCount => {
                    if (prevCount < 5) {
                        toast.error('Error fetching subsubcategories');
                    }
                    return prevCount + 1;
                });
                console.error('Error fetching subsubcategories', error);
            }
        };

        fetchSubSubcategories();
    }, [addSubSubcategoryOpen, editSubSubcategoryOpen, deleteSubSubcategoryOpen, axiosInstance]);

    const refreshSubSubcategories = async () => {
        try {
            const response = await axiosInstance.get('/subsubcategories/get');
            setSubSubcategories(response.data);
            setFetchErrorCount(0);
        } catch (error) {
            setFetchErrorCount(prevCount => {
                if (prevCount < 5) {
                    toast.error('Error fetching subsubcategories');
                }
                return prevCount + 1;
            });
            console.error('Error fetching subsubcategories', error);
        }
    };

    const handleSelectSubSubcategory = (subSubcategoryId) => {
        setSelectedSubSubcategories((prevSelected) => {
            if (prevSelected.includes(subSubcategoryId)) {
                return prevSelected.filter(id => id !== subSubcategoryId);
            } else {
                return [...prevSelected, subSubcategoryId];
            }
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedSubSubcategories(subSubcategories.map(subSubcategory => subSubcategory._id));
        } else {
            setSelectedSubSubcategories([]);
        }
    };

    return (
        <>
            <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
                <div className='flex flex-col items-center justify-center'>
                    <div className='flex items-center justify-between w-full mb-4'>
                        <Typography variant='h5'>SubSubcategories</Typography>
                        <div>
                            <OutlinedBrownButton onClick={() => setAddSubSubcategoryOpen(true)} className='!mr-4'>Add SubSubcategory</OutlinedBrownButton>
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
                    <TableContainer component={Paper} className='max-w-screen-2xl mx-auto'>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <BoldTableCell>
                                        <Checkbox
                                            checked={selectedSubSubcategories.length === subSubcategories.length}
                                            onChange={handleSelectAll}
                                        />
                                    </BoldTableCell>
                                    <BoldTableCell>Name</BoldTableCell>
                                    <BoldTableCell>Subcategory</BoldTableCell>
                                    <BoldTableCell>Actions</BoldTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {subSubcategories.map((subSubcategory) => (
                                    <TableRow key={subSubcategory._id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedSubSubcategories.includes(subSubcategory._id)}
                                                onChange={() => handleSelectSubSubcategory(subSubcategory._id)}
                                            />
                                        </TableCell>
                                        <TableCell>{subSubcategory.name}</TableCell>
                                        <TableCell>{subSubcategory.subcategory.name}</TableCell>
                                        <TableCell>
                                            <ActionButton onClick={() => { setSelectedSubSubcategory(subSubcategory); setEditSubSubcategoryOpen(true); }}><BrownCreateOutlinedIcon /></ActionButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <AddSubSubcategoryModal open={addSubSubcategoryOpen} onClose={() => setAddSubSubcategoryOpen(false)} onAddSuccess={refreshSubSubcategories} />
                    <EditSubSubcategoryModal open={editSubSubcategoryOpen} onClose={() => setEditSubSubcategoryOpen(false)} subSubcategory={selectedSubSubcategory} onEditSuccess={refreshSubSubcategories} />
                    <DeleteSubSubcategoryModal open={deleteSubSubcategoryOpen} onClose={() => setDeleteSubSubcategoryOpen(false)} subSubcategories={selectedSubSubcategories.map(id => subSubcategories.find(subSubcategory => subSubcategory._id === id))} onDeleteSuccess={refreshSubSubcategories} />
                </div>
            </div>
        </>
    );
};

export default SubSubcategoriesPage;