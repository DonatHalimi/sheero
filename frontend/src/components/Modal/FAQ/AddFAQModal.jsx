import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, handleApiError, LoadingLabel } from '../../../assets/CustomComponents';
import { addFAQService } from '../../../services/faqService';

const AddFAQModal = ({ open, onClose, onAddSuccess }) => {
    const [question, setQuestion] = useState('');
    const [isValidQuestion, setIsValidQuestion] = useState(true);
    const [answer, setAnswer] = useState('');
    const [isValidAnswer, setIsValidAnswer] = useState(true);
    const [loading, setLoading] = useState(false);

    const validateFAQ = (v) => /^[A-Z][\s\S]{10,50}$/.test(v);
    const isValidForm = isValidQuestion && isValidAnswer && question && answer;

    const handleAddFAQ = async () => {
        setLoading(true);

        if (!question || !answer) {
            toast.error('Please fill in all the fields');
            return;
        }

        const data = {
            question,
            answer
        }

        try {
            const response = await addFAQService(data);
            toast.success(response.data.message);
            onAddSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error adding faq');
        } finally {
            setLoading(false);
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
                    disabled={!isValidForm || loading}
                    className="w-full"
                >
                    <LoadingLabel loading={loading} />
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default AddFAQModal;
