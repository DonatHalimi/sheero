export const slideShowSkeletonSx = {
    position: 'absolute',
    top: '50%',
    left: '20px',
    transform: 'translateY(-50%)',
    zIndex: 10
}

export const goBackButtonSx = {
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

export const reviewTitleSx = {
    maxWidth: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontWeight: 600
}

export const reviewCommentSx = {
    maxWidth: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
}

export const reviewContainerSx = {
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

export const reviewImageSx = {
    width: { xs: '100%', sm: '40%' },
    flexShrink: 0,
    mr: { sm: 2 },
    mb: { xs: 2, sm: 0 },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}

export const reviewContentSx = {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    textAlign: 'justify'
}

export const reviewTitleContainerSx = {
    textAlign: 'justify',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100%',
    fontWeight: 600,
    marginTop: '4px',
    overflowWrap: 'break-word'
}

export const reviewTextAreaSx = {
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

export const paginationStackSx = (customSx = {}) => ({
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

export const searchBarInputSx = {
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

export const headerSearchSx = {
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

export const headerFilterSx = {
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

export const searchDropdownSx = {
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

export const searchDropdownItemSx = {
    bgcolor: 'white',
    borderRadius: 1,
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
    marginBottom: '8px',
    backgroundColor: '#e0e0e0',
    '&:hover': {
        backgroundColor: '#e0e0e0',
    },
    transition: 'border-color 0.2s ease',
}

export const searchDropdownImageSx = {
    width: '40px',
    height: '40px',
    marginLeft: '-10px',
    marginRight: '10px',
    objectFit: 'contain',
}

export const sidebarLayoutSx = {
    position: { xs: 'static', md: 'sticky' },
    top: { md: '100px' },
    left: { md: '100px' },
    width: { xs: '100%', md: '315px' },
    bgcolor: 'white',
    p: { xs: 2, md: 3 },
    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    borderRadius: '6px',
    zIndex: 1000,
    mt: { xs: 10, md: 5 },
    zIndex: 1,
    alignSelf: 'flex-start',
};

export const profileLayoutSx = {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    maxWidth: '1250px',
    mx: 'auto',
    px: { xs: 2, md: 3 },
    gap: { md: 2 },
    position: 'relative',
    mb: 10,
    mt: 5,
    alignItems: 'flex-start',
};

export const layoutContainerSx = {
    flex: 1,
    width: '100%',
    mt: { xs: 4, md: 5 },
};

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

export const filterLayoutSx = {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    maxWidth: '1250px',
    mx: 'auto',
    px: { xs: 2, md: 3 },
    gap: { md: 2 },
    position: 'relative',
    mb: 10,
    mt: 5,
}

export const getMotionDivProps = (isOpen) => ({
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: 'auto' },
    exit: { opacity: 0, height: 0 },
    transition: { duration: 0.3 },
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

export const dashboardDrawerSx = (open) => ({
    width: open ? 250 : 78,
    transition: 'width 0.4s ease-in-out',
    height: '100vh',
    overflow: 'hidden',
    zIndex: 1000,
    '& .custom-scrollbar': {
        height: '100%',
        overflowY: 'auto',
    },
    '& .MuiDrawer-paper': {
        width: open ? 250 : 78,
        transition: 'width 0.4s ease-in-out',
    },
});

export const dashboardBoxSx = {
    backgroundColor: (theme) =>
        theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
};

export const dashboardHeaderSx = (theme) => ({
    backgroundColor: theme.palette.background.default,
    borderColor: theme.palette.mode === 'dark' ? theme.palette.divider : '#e5e7eb',
});

export const dashboardTitleSx = (theme) => ({
    fontSize: '1.3rem',
    fontWeight: 500,
    padding: '4px 10px',
    color: theme.palette.text.primary,
});

export const addItemSx = (theme) => ({
    borderColor: theme.palette.mode === 'dark' ? theme.palette.divider : '#7C7164',
    color: theme.palette.mode === 'dark' ? theme.palette.text.primary : '#5b504b',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
});

export const deleteItemSx = (theme) => ({
    borderColor: theme.palette.mode === 'dark' ? theme.palette.divider : '#7C7164',
    color: theme.palette.mode === 'dark' ? theme.palette.text.primary : '#5b504b',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
});

export const exportIconSx = (theme) => ({ color: theme.palette.mode === 'dark' ? theme.palette.text.primary : '#6b7280' });

export const profileDropdownContainerSx = (theme) => ({
    backgroundColor: theme.palette.background.paper,
    borderColor: theme.palette.divider,
});

export const profileDropdownButtonSx = (theme) => ({ color: theme.palette.text.primary });

export const profileIconSx = (theme) => ({ color: theme.palette.text.primary });

export const dashboardSearchSuggestionsSx = (theme) => ({
    backgroundColor: theme.palette.background.paper,
    borderColor: theme.palette.divider,
});

export const dashboardSearchItemsSx = ({ theme }, { index, selectedIndex }) => ({
    backgroundColor: index === selectedIndex
        ? theme.palette.action.selected
        : 'transparent',
    borderColor: index === selectedIndex
        ? theme.palette.primary.main
        : 'transparent',
    color: theme.palette.text.primary,
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
})

export const dashboardSearchItemSx = (theme) => ({ color: theme.palette.text.secondary });

export const dashboardAppBarSx = (theme) => ({
    boxShadow: '1px 0px 3px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
});

export const dashboardToolBarSx = (theme) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
});

export const dashboardTablePaperSx = (theme) => ({
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1]
});

export const deleteModalBoxSx = (theme) => ({ backgroundColor: theme.palette.background.paper });

export const deleteModalTypographySx = (theme) => ({ color: theme.palette.text.primary });

export const deleteModalButtonSx = (theme) => ({
    color: theme.palette.text.primary,
    borderColor: theme.palette.divider,
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
});

export const loadingDataGridContainerSx = (theme) => ({ backgroundColor: theme.palette.background.default });

export const loadingDataGridSkeletonSx = (theme) => ({ backgroundColor: theme.palette.mode === 'dark' ? theme.palette.action.hover : undefined })

export const dashboardTableSx = (theme) => ({
    border: 'none',
    '& .MuiDataGrid-main': {
        border: 'none',
    },
    '& .MuiDataGrid-columnHeader:focus': {
        outline: 'none',
    },
    '& .MuiDataGrid-columnHeader:focus-within': {
        outline: 'none',
    },
    '& .MuiDataGrid-cell:focus': {
        outline: 'none',
    },
    '& .MuiDataGrid-cell:focus-within': {
        outline: 'none',
    },
    '--DataGrid-overlayHeight': '300px',
    '& .MuiDataGrid-toolbarContainer button': {
        color: theme.palette.mode === 'dark' ? theme.palette.text.primary : '#5B504B',
    },
});

export const drawerPaperSx = {
    sx: {
        width: '30%',
        minWidth: '300px',
        maxWidth: '500px',
        padding: 3,
        zIndex: 9999,
    }
}

export const iconButtonSx = {
    position: 'absolute',
    top: 10,
    right: 10,
}

export const chipSx = {
    width: '100%',
    padding: '4px 0',
    '& .MuiChip-root': {
        maxWidth: '100%',
        textAlign: 'left',
        height: 'auto',
        borderRadius: '4px',
        '& .MuiChip-label': {
            whiteSpace: 'normal',
            overflow: 'visible',
            textOverflow: 'clip',
            display: 'block',
            padding: '8px 12px',
            textAlign: 'left',
        },
    },
}

export const customModalSx = {
    "&:focus": { outline: "none !important" },
    "& *:focus": { outline: "none !important" }
};

export const boxSx = (theme) => ({
    "&:focus": { outline: "none !important" },
    backgroundColor: theme.palette.background.paper,
});

export const customBoxSx = (theme) => ({ backgroundColor: theme.palette.background.paper })

export const profileBoxSx = {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    gap: { xs: 3, md: 2 }
}