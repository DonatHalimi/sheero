import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography } from '../../../assets/CustomComponents';
import useAxios from '../../../axiosInstance';

const AddFAQModal = ({ open, onClose, onAddSuccess }) => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    const axiosInstance = useAxios();

    const handleAddFAQ = async () => {
        if (!question || !answer) {
            toast.error('Please fill in all the fields');
            return;
        }

        const data = {
            question,
            answer
        }

        try {
            const response = await axiosInstance.post('/faqs/create', data);
            toast.success(response.data.message);
            onAddSuccess(response.data);
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
