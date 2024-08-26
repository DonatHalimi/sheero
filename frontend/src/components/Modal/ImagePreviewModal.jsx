import CloseIcon from '@mui/icons-material/Close';
import { Modal } from '@mui/material';
import React from 'react';
import { CloseButtonStyled, StyledBox, StyledImage } from '../../assets/CustomComponents';

const ImagePreviewModal = ({ open, onClose, imageUrl }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <StyledBox onClick={onClose}>
                <CloseButtonStyled onClick={onClose}>
                    <CloseIcon />
                </CloseButtonStyled>

                <StyledImage
                    src={imageUrl}
                    alt="Preview"
                    onClick={(e) => e.stopPropagation()}
                />
            </StyledBox>
        </Modal>
    );
};

export default ImagePreviewModal;