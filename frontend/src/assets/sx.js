export const slideShowSkeletonStyling = {
    position: 'absolute',
    top: '50%',
    left: '20px',
    transform: 'translateY(-50%)',
    zIndex: 10
}

export const goBackButtonStyling = {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    textTransform: 'none',
    padding: '10px 14px',
    backgroundColor: '#686159',
    '&:hover': {
        backgroundColor: '#5b504b',
    },
    borderRadius: '5px',
    boxShadow: 'none',
    width: '50%',
    margin: '0 auto',
}

export const reviewTitleStyling = {
    maxWidth: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontWeight: 600
}

export const reviewCommentStyling = {
    maxWidth: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
}

export const reviewContainerStyling = {
    position: 'relative',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: '80%' },
    maxWidth: '800px',
    bgcolor: 'background.paper',
    borderRadius: '8px',
    boxShadow: 24,
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    p: 2,
    outline: 'none',
}

export const reviewImageStyling = {
    width: { xs: '100%', sm: '40%' },
    flexShrink: 0,
    mr: { sm: 2 },
    mb: { xs: 2, sm: 0 },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}

export const reviewContentStyling = {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    textAlign: 'justify'
}

export const reviewTitleContainerStyling = {
    textAlign: 'justify',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100%',
    fontWeight: 600,
    marginTop: '4px',
    overflowWrap: 'break-word'
}

export const reviewTextAreaStyling = {
    width: '90%',
    height: 'auto',
    minHeight: '150px',
    maxHeight: '200px',
    overflowY: 'auto',
    border: 'none',
    background: 'transparent',
    resize: 'none',
    fontSize: '16px',
    boxSizing: 'border-box',
    borderRadius: '4px',
    marginTop: '6px',
    outline: 'none',
    textAlign: 'left'
}

export const paginationStackStyling = (customSx = {}) => ({
    marginTop: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...customSx,
})

export const paginationStyling = (customSx = {}) => ({
    '& .MuiPaginationItem-page': {
        color: '#686159',
    },
    '& .MuiPaginationItem-page.Mui-selected': {
        backgroundColor: '#686159',
        color: 'white',
        '&:hover': {
            backgroundColor: '#686159',
            color: 'white',
        },
    },
    '& .MuiPaginationItem-page:not(.Mui-selected):hover': {
        backgroundColor: '#686159',
        color: 'white',
    },
    ...customSx
});

export const searchBarInputStyling = {
    width: {
        xs: '350px',
        sm: '400px',
        md: '475px'
    },
    borderColor: '#9e9793',
    '& .MuiInputBase-root': {
        height: '40px',
        display: 'flex',
        alignItems: 'center'
    },
    '& .MuiInputBase-input': {
        padding: '0 14px',
        height: '40px',
        lineHeight: '40px',
    },
}

export const headerSearchStyling = {
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'rgba(0, 0, 0, 0.23)',
        },
        '&:focus fieldset': {
            borderColor: 'rgba(0, 0, 0, 0.23)',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'rgba(0, 0, 0, 0.23)',
        },
    },
}

export const headerFilterStyling = {
    width: 120,
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(0, 0, 0, 0.23)',
    },
    '&:focus .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(0, 0, 0, 0.23)',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(0, 0, 0, 0.23)',
    },
}

export const searchDropdownStyling = {
    position: 'absolute',
    width: {
        xs: '350px',
        sm: '400px',
        md: '475px'
    },
    bgcolor: '#F9FAFB',
    boxShadow: 1,
    borderRadius: 1,
    maxHeight: '400px',
    overflowY: 'auto',
    zIndex: 99,
    top: '41px',
    padding: '9px',
}

export const searchDropdownItemStyling = {
    bgcolor: 'white',
    borderRadius: 1,
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
    marginBottom: '8px',
    border: '1px solid transparent',
    '&:hover': {
        borderColor: '#78716C',
        backgroundColor: 'white',
    },
    transition: 'border-color 0.2s ease',
}

export const searchDropdownImageStyling = {
    width: '40px',
    height: '40px',
    marginLeft: '-10px',
    marginRight: '10px',
    objectFit: 'contain',
}

export const sidebarLayoutStyling = {
    position: { xs: 'static', md: 'absolute' },
    top: { md: '24px' },
    left: { md: '10' },
    width: { xs: '100%', md: '320px' },
    bgcolor: 'white',
    p: { xs: 2, md: 3 },
    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    borderRadius: '6px',
    mt: { xs: 10, md: 2 }
}

export const customMenuProps = {
    PaperProps: {
        sx: {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
            transform: 'translate(-10px, 10px)',
        },
    },
    anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right',
    },
    transformOrigin: {
        vertical: 'top',
        horizontal: 'right',
    },
};

export const profileLayoutStyling = {
    maxWidth: '1250px',
    mx: 'auto',
    px: { xs: 2, md: 3 },
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    gap: { md: 3 },
    position: 'relative',
    mb: 10,
    mt: 5
}

export const layoutContainerStyle = { flex: 1, ml: { md: '332px' }, width: '100%', mt: { xs: 4, md: 5 }, }

export const filterLayoutStyling = {
    maxWidth: '1250px',
    mx: 'auto',
    px: { xs: 2, md: 3 },
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    gap: { md: 3 },
    position: 'relative',
    mb: 10,
    mt: { xs: 18, md: 5 },
}

export const getMotionDivProps = (isOpen) => ({
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: 'auto' },
    exit: { opacity: 0, height: 0 },
    transition: { duration: 0.3 },
    className: 'bg-white rounded-b-md shadow-md mt-1 overflow-hidden',
});

export const getExpandIconProps = (isOpen) => ({
    animate: { rotate: isOpen ? 180 : 0 },
    transition: { duration: 0.3 },
});

export const paginationSx = {
    position: 'relative',
    bottom: '4px',
    '& .MuiPagination-ul': {
        justifyContent: 'flex-start',
    },
}