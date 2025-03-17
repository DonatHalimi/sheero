import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ActionButtons, CustomBox, CustomModal, CustomTextField, CustomTypography } from '../../../assets/CustomComponents';
import { editFAQService } from '../../../services/faqService';
import { FAQValidations } from '../../../utils/validations/faq';

const EditFAQModal = ({ open, onClose, faq, onViewDetails, onEditSuccess }) => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);

    const validateQuestion = (v) => FAQValidations.questionRules.pattern.test(v);
    const validateAnswer = (v) => FAQValidations.answerRules.pattern.test(v);

    const isFormValid = validateQuestion(question) && validateAnswer(answer) && question && answer;

    useEffect(() => {
        if (faq) {
            setQuestion(faq.question);
            setAnswer(faq.answer);
        }
    }, [faq]);

    const handleEditFAQ = async () => {
        setLoading(true);

        const updatedData = {
            question,
            answer
        }

        try {
            const response = await editFAQService(faq._id, updatedData);
            toast.success(response.data.message);
            onEditSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error updating faq');
        } finally {
            setLoading(false);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Edit FAQ</CustomTypography>

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

                <ActionButtons
                    primaryButtonLabel="Save"
                    secondaryButtonLabel="View Details"
                    onPrimaryClick={handleEditFAQ}
                    onSecondaryClick={() => {
                        onViewDetails(faq);
                        onClose();
                    }}
                    primaryButtonProps={{
                        disabled: !isFormValid || loading
                    }}
                    loading={loading}
                />
            </CustomBox>
        </CustomModal>
    );
};

export default EditFAQModal;
