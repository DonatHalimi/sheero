import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography } from '../../../assets/CustomComponents';
import useAxios from '../../../utils/axiosInstance';

const EditFAQModal = ({ open, onClose, faq, onEditSuccess }) => {
    const [question, setQuestion] = useState('');
    const [isValidQuestion, setIsValidQuestion] = useState(true);
    const [answer, setAnswer] = useState('');
    const [isValidAnswer, setIsValidAnswer] = useState(true);

    const axiosInstance = useAxios();

    const validateFAQ = (v) => /^[A-Z][a-zA-Z\s]{10,50}$/.test(v);
    const isValidForm = isValidQuestion && isValidAnswer;

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
            handleApiError(error, 'Error updating faq');
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
                    onChange={(e) => {
                        setQuestion(e.target.value)
                        setIsValidQuestion(validateFAQ(e.target.value));
                    }}
                    error={!isValidQuestion}
                    helperText={!isValidQuestion ? 'Question must start with a capital letter and be between 10 and 50 characters long' : ''}
                    className="!mb-4"
                />
                <BrownOutlinedTextField
                    fullWidth
                    required
                    label="Answer"
                    value={answer}
                    multiline
                    rows={4}
                    onChange={(e) => {
                        setAnswer(e.target.value)
                        setIsValidAnswer(validateFAQ(e.target.value));
                    }}
                    error={!isValidAnswer}
                    helperText={!isValidAnswer ? 'Answer must start with a capital letter and be between 10 and 50 characters long' : ''}
                    className="!mb-4"
                />
                <BrownButton
                    onClick={handleEditFAQ}
                    variant="contained"
                    color="primary"
                    disabled={!isValidForm}
                    className="w-full"
                >
                    Save
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default EditFAQModal;
