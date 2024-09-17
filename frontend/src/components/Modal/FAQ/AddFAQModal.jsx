import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography } from '../../../assets/CustomComponents';
import useAxios from '../../../axiosInstance';
import { AuthContext } from '../../../context/AuthContext';

const AddFAQModal = ({ open, onClose, onAddSuccess }) => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    const handleAddFAQ = async () => {
        if (!question || !answer) {
            toast.error('Please fill in all the fields', {
                closeOnClick: true
            });
            return;
        }

        try {
            await axiosInstance.post('/faqs/create', { question, answer });
            toast.success('FAQ item added successfully');
            onAddSuccess();
            onClose();
        } catch (error) {
            toast.error('Error adding FAQ item');
            console.error('Error adding FAQ item', error);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Add FAQ</CustomTypography>

                <BrownOutlinedTextField
                    fullWidth
                    required
                    label="Question"
                    value={question}
                    multiline
                    rows={2}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="!mb-4"
                />

                <BrownOutlinedTextField
                    fullWidth
                    required
                    label="Answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    multiline
                    rows={4}
                    className="!mb-4"
                />
                <BrownButton
                    onClick={handleAddFAQ}
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

export default AddFAQModal;
