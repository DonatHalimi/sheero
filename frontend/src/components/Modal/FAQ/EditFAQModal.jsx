import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography } from '../../../assets/CustomComponents';
import useAxios from '../../../axiosInstance';

const EditFAQModal = ({ open, onClose, faq, onEditSuccess }) => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    const axiosInstance = useAxios();

    useEffect(() => {
        if (faq) {
            setQuestion(faq.question);
            setAnswer(faq.answer);
        }
    }, [faq]);

    const handleEditFAQ = async () => {
        const updatedData = {
            question,
            answer
        }

        try {
            const response = await axiosInstance.put(`/faqs/update/${faq._id}`, updatedData);
            toast.success(response.data.message);
            onEditSuccess(response.data);
            onClose();
        } catch (error) {
            toast.error('Error updating FAQ');
            console.error('Error updating FAQ', error);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Edit FAQ</CustomTypography>

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
                    multiline
                    rows={4}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="!mb-4"
                />
                <BrownButton
                    onClick={handleEditFAQ}
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

export default EditFAQModal;
