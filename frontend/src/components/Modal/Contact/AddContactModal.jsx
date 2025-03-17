import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { BrownButton, CustomBox, CustomModal, CustomTextField, CustomTypography, handleApiError, LoadingLabel } from '../../../assets/CustomComponents';
import { addContactService } from '../../../services/contactService';
import { ContactValidations } from '../../../utils/validations/contact';

const AddContactModal = ({ open, onClose, onAddSuccess }) => {
    const { user } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [loading, setLoading] = useState(false);

    const validateName = (v) => ContactValidations.nameRules.pattern.test(v);
    const validateEmail = (v) => ContactValidations.emailRules.pattern.test(v);
    const validateSubject = (v) => ContactValidations.subjectRules.pattern.test(v);
    const validateMessage = (v) => ContactValidations.messageRules.pattern.test(v);

    const isFormValid =
        validateName(formData.name) &&
        validateEmail(formData.email) &&
        validateSubject(formData.subject) &&
        validateMessage(formData.message);

    useEffect(() => {
        if (user) {
            setFormData((prev) => ({ ...prev, name: user.firstName || '', email: user.email || '' }));
        }
    }, [user]);

    const handleAddContact = async () => {
        setLoading(true);

        try {
            const response = await addContactService(formData);
            toast.success(response.data.message);
            onAddSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error adding contact');
        } finally {
            setLoading(false);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Add Contact Message</CustomTypography>

                <CustomTextField
                    label="Name"
                    value={formData.name}
                    setValue={(v) => setFormData((prev) => ({ ...prev, name: v }))}
                    validate={validateName}
                    validationRule={ContactValidations.nameRules}
                    disabled={!!user}
                />

                <CustomTextField
                    label="Email"
                    value={formData.email}
                    setValue={(v) => setFormData((prev) => ({ ...prev, email: v }))}
                    validate={validateEmail}
                    validationRule={ContactValidations.emailRules}
                    disabled={!!user}
                />

                <CustomTextField
                    label="Subject"
                    value={formData.subject}
                    setValue={(v) => setFormData((prev) => ({ ...prev, subject: v }))}
                    validate={validateSubject}
                    validationRule={ContactValidations.subjectRules}
                />

                <CustomTextField
                    label="Message"
                    value={formData.message}
                    setValue={(v) => setFormData((prev) => ({ ...prev, message: v }))}
                    validate={validateMessage} validationRule={ContactValidations.messageRules}
                    multiline
                    rows={4}
                />

                <BrownButton onClick={handleAddContact} variant="contained" color="primary" disabled={!isFormValid || loading} className="w-full">
                    <LoadingLabel loading={loading} />
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default AddContactModal;