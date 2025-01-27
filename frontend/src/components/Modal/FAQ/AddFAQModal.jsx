import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, handleApiError } from '../../../assets/CustomComponents';
import useAxios from '../../../utils/axiosInstance';

const AddFAQModal = ({ open, onClose, onAddSuccess }) => {
    const [question, setQuestion] = useState('');
    const [isValidQuestion, setIsValidQuestion] = useState(true);
    const [answer, setAnswer] = useState('');
    const [isValidAnswer, setIsValidAnswer] = useState(true);

    const axiosInstance = useAxios();

    const validateFAQ = (v) => /^[A-Z][\s\S]{10,50}$/.test(v);
    const isValidForm = isValidQuestion && isValidAnswer;

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
            handleApiError(error, 'Error adding faq');
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
                        setAnswer(e.target.value);
                        setIsValidAnswer(validateFAQ(e.target.value));
                    }}
                    error={!isValidAnswer}
                    helperText={!isValidAnswer ? 'Answer must start with a capital letter and be between 10 and 50 characters long' : ''}
                    className="!mb-4"
                />
                <BrownButton
                    onClick={handleAddFAQ}
                    variant="contained"
                    color="primary"
                    disabled={!isValidForm}
                    className="w-full"
                >
                    Add
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default AddFAQModal;
