import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography } from '../../../assets/CustomComponents';
import useAxios from '../../../axiosInstance';
import { AuthContext } from '../../../context/AuthContext';

const EditCountryModal = ({ open, onClose, country, onEditSuccess }) => {
    const [name, setName] = useState('');
    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        if (country) {
            setName(country.name);
        }
    }, [country]);

    const handleEditCountry = async () => {
        if (!name) {
            toast.error('Please fill in the country name', { closeOnClick: true });
            return;
        }

        const updatedData = {
            name
        }

        try {
            const response = await axiosInstance.put(`/countries/update/${country._id}`, updatedData);
            toast.success(response.data.message);
            onEditSuccess(response.data);
            onClose();
        } catch (error) {
            toast.error('Error updating country');
            console.error('Error updating country', error);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Edit Country</CustomTypography>

                <BrownOutlinedTextField
                    fullWidth
                    required
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="!mb-4"
                />

                <BrownButton
                    onClick={handleEditCountry}
                    variant="contained"
                    color="primary"
                    className="w-full"
                >
                    Save
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default EditCountryModal;
