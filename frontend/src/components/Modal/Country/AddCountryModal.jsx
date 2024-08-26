import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography } from '../../../assets/CustomComponents';
import useAxios from '../../../axiosInstance';
import { AuthContext } from '../../../context/AuthContext';

const AddCountryModal = ({ open, onClose, onAddSuccess }) => {
    const [name, setName] = useState('');

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    const handleAddCountry = async () => {
        if (!name) {
            toast.error('Please fill in the country name', {
                closeOnClick: true
            });
            return;
        }

        try {
            await axiosInstance.post('/countries/create', { name });
            toast.success('Country added successfully');
            onAddSuccess();
            onClose();
        } catch (error) {
            if (error.response && error.response.status === 403) {
                toast.error('You do not have permission to perform this action');
            } else {
                toast.error('Error adding country');
            }
            console.error('Error adding country', error);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Add Country</CustomTypography>

                <BrownOutlinedTextField
                    fullWidth
                    required
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="!mb-4"
                />
                <BrownButton
                    onClick={handleAddCountry}
                    variant="contained"
                    color="primary"
                    className="w-full"
                >
                    Add
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default AddCountryModal;
