import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, CustomBox, CustomModal, CustomTextField, CustomTypography, handleApiError, LoadingLabel } from '../../../assets/CustomComponents';
import { addFAQService } from '../../../services/faqService';
import { FAQValidations } from '../../../utils/validations/faq';

const AddFAQModal = ({ open, onClose, onAddSuccess }) => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);

    const validateQuestion = (v) => FAQValidations.questionRules.pattern.test(v);
    const validateAnswer = (v) => FAQValidations.answerRules.pattern.test(v);

    const isFormValid = validateQuestion(question) && validateAnswer(answer) && question && answer;

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

                <CustomTextField
                    label="Question"
                    value={question}
                    setValue={setQuestion}
                    validate={validateQuestion}
                    validationRule={FAQValidations.questionRules}
                    multiline
                    rows={3}
                />

                <CustomTextField
                    label="Answer"
                    value={answer}
                    setValue={setAnswer}
                    validate={validateAnswer}
                    validationRule={FAQValidations.answerRules}
                    multiline
                    rows={3}
                />
                <BrownButton
                    onClick={handleAddFAQ}
                    variant="contained"
                    color="primary"
                    disabled={!isFormValid || loading}
                    className="w-full"
                >
                    <LoadingLabel loading={loading} />
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default AddFAQModal;
