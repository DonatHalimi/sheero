import {
    ArrowBack,
    ChevronLeft,
    CreateOutlined,
    DashboardOutlined,
    DeleteOutlined,
    ExpandLess,
    ExpandMore,
    FavoriteBorderOutlined,
    InboxOutlined,
    Logout,
    PersonOutlined,
    QuestionAnswerOutlined,
    Settings,
    ShoppingCart,
    ShoppingCartOutlined,
    Star,
    StarBorder
} from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import {
    Box,
    Breadcrumbs,
    Button,
    Collapse,
    FormControl,
    IconButton,
    Link,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Modal,
    AppBar as MuiAppBar, Drawer as MuiDrawer,
    Pagination,
    Paper,
    Skeleton,
    Stack,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SvgIcon from '@mui/material/SvgIcon';
import { GridToolbar } from '@mui/x-data-grid';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import useAxios from '../axiosInstance';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import emptyCartImage from './img/empty-cart.png';
import emptyWishlistImage from './img/empty-wishlist.png';
import notAllowed from './img/not-allowed.png';
import notFound from './img/not-found.png';

export const BrownOutlinedTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: '#7C7164',
        },
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#7C7164',
    },
});

export const BrownButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#686159',
    color: 'white',
    '&:hover': {
        backgroundColor: '#5b504b',
    },
}));

export const BoldTableCell = styled(TableCell)({
    fontWeight: 'bold',
    backgroundColor: '#F8F8F8'
});

export const OutlinedBrownButton = styled(Button)(({ theme }) => ({
    color: '#493c30',
    borderColor: '#83776B',
    borderWidth: '1px',
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    '&:hover': {
        borderColor: '#5b504b',
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
}));

export const ActionButton = styled(Button)(({ theme }) => ({
    position: 'relative',
    right: '10px',
    width: '30px',
    height: '30px',
    '&:hover': {
        backgroundColor: '#F8F8F8',
    },
}));

export const BrownCreateOutlinedIcon = styled(CreateOutlined)({
    color: '#493c30',
});

export const BrownDeleteOutlinedIcon = styled(DeleteOutlined)({
    color: '#493c30',
    '&:hover': {
        cursor: 'pointer',
    }
});

export const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export const OutlinedBrownFormControl = styled(FormControl)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: '#7C7164',
        },
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#7C7164',
    },
}));

const drawerWidth = 240;

export const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    backgroundColor: 'white',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

export const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    })
);

export const ActiveListItemButton = styled(ListItemButton)(({ selected }) => ({
    backgroundColor: selected ? '#7C7164' : 'white',
    color: selected ? 'black' : 'inherit',
    borderRight: selected ? '3px solid #7C7164' : '',
    '&:hover': {
        backgroundColor: selected ? 'darkred' : '#F8F8F8',
    },
}));

export const CollapsibleListItem = ({ open, handleClick, icon, primary, children }) => (
    <>
        <ListItemButton onClick={handleClick}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={primary} />
            {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
                {children}
            </List>
        </Collapse>
    </>
);

export const ActiveListItem = ({ icon, primary, handleClick, selected, sx }) => (
    <ActiveListItemButton onClick={handleClick} selected={selected} sx={sx}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={primary} />
    </ActiveListItemButton>
);

export const AddToCartButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#f7f7f7',
    color: '#57534E',
    '&:hover': {
        backgroundColor: '#686159',
        color: 'white',
        '& .MuiSvgIcon-root': {
            color: 'white',
        },
    },
    flexGrow: 1,
    marginRight: theme.spacing(2),
}));

export const WishlistButton = styled(Button)(({ theme }) => ({
    color: '#493c30',
    backgroundColor: '#f7f7f7',
    '&:hover': {
        borderColor: '#5b504b',
        backgroundColor: '#686159',
        color: 'white',
    },
    flexShrink: 0,
}));

export const BrownShoppingCartIcon = styled(ShoppingCart)(({ theme }) => ({
    color: '#57534E',
    marginRight: 20,
    transition: 'color 0.3s ease',
}));

export const CustomTab = styled(Tab)(({ theme }) => ({
    flex: 1,
    textTransform: 'none',
    borderBottom: '1px solid #dddddd',
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover': {
        backgroundColor: '#f2f2f2',
        color: '#59514a',
    },
    '&.Mui-selected': {
        borderBottom: `2px solid ${theme.palette.primary.main}`,
        width: '50%',
        fontWeight: 'bold',
        '&:hover': {
            backgroundColor: 'inherit',
            color: 'inherit',
        },
    },
}));

export const ReviewCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
}));

export const ReviewContent = styled(Box)(({ theme }) => ({
    flex: 1,
}));

export const RatingStars = ({ rating }) => {
    const stars = Array(5).fill(false).map((_, index) => index < rating);
    return (
        <Box display="flex">
            {stars.map((filled, index) =>
                filled ? <Star key={index} color="primary" /> : <StarBorder key={index} />
            )}
        </Box>
    );
};

export function HomeIcon(props) {
    return (
        <SvgIcon {...props} style={{ fontSize: 20, marginBottom: 0.5 }}>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </SvgIcon>
    );
}

export const RoundIconButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.primary.contrastText,
    width: '40px',
    height: '40px',
}));

export const ProfileButton = styled(IconButton)(({ theme }) => ({
    color: 'black',
    width: '100px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: '0.125rem',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));

export const CustomToolbar = () => {
    return (
        <>
            <div className="flex justify-end px-4">
                <GridToolbar />
            </div>
            <hr className="border-t border-gray-200 my-2" />
        </>
    );
};

export const StyledGridOverlay = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    '& .no-rows-primary': {
        fill: '#817369',
    },
    '& .no-rows-secondary': {
        fill: '#A49589',
    },
}));

export const StyledBox = styled(Box)(({ theme }) => ({
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

export const CloseButtonStyled = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    top: 16,
    right: 16,
    color: '#fff',
    zIndex: 1400,
}));

export const StyledImage = styled('img')({
    maxHeight: '80%',
    maxWidth: '80%',
    objectFit: 'contain',
    borderRadius: '10px',
});

export function CustomNoRowsOverlay() {
    return (
        <StyledGridOverlay>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                width={96}
                viewBox="0 0 452 257"
                aria-hidden
                focusable="false"
            >
                <path
                    className="no-rows-primary"
                    d="M348 69c-46.392 0-84 37.608-84 84s37.608 84 84 84 84-37.608 84-84-37.608-84-84-84Zm-104 84c0-57.438 46.562-104 104-104s104 46.562 104 104-46.562 104-104 104-104-46.562-104-104Z"
                />
                <path
                    className="no-rows-primary"
                    d="M308.929 113.929c3.905-3.905 10.237-3.905 14.142 0l63.64 63.64c3.905 3.905 3.905 10.236 0 14.142-3.906 3.905-10.237 3.905-14.142 0l-63.64-63.64c-3.905-3.905-3.905-10.237 0-14.142Z"
                />
                <path
                    className="no-rows-primary"
                    d="M308.929 191.711c-3.905-3.906-3.905-10.237 0-14.142l63.64-63.64c3.905-3.905 10.236-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142l-63.64 63.64c-3.905 3.905-10.237 3.905-14.142 0Z"
                />
                <path
                    className="no-rows-secondary"
                    d="M0 10C0 4.477 4.477 0 10 0h380c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 20 0 15.523 0 10ZM0 59c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 69 0 64.523 0 59ZM0 106c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 153c0-5.523 4.477-10 10-10h195.5c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 200c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 247c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10Z"
                />
            </svg>
            <Box className='mt-4 font-bold text-stone-500'>No rows found</Box>
        </StyledGridOverlay>
    );
}

export const CustomPaper = (props) => (
    <Paper {...props} sx={{ maxHeight: 200, overflow: 'auto' }} />
);

export const StyledPersonIcon = styled(PersonOutlined)({
    color: '#666666',
});

export const StyledDashboardIcon = styled(DashboardOutlined)({
    color: '#666666',
});

export const StyledSettingsIcon = styled(Settings)({
    color: '#666666',
});

export const StyledLogoutIcon = styled(Logout)({
    color: '#666666',
});

export const StyledFavoriteIcon = styled(FavoriteBorderOutlined)({
    color: '#666666',
});

export const StyledInboxIcon = styled(InboxOutlined)({
    color: '#666666',
});

export const StyledShoppingCartIcon = styled(ShoppingCartOutlined)({
    color: '#666666',
});

export const DashboardStyling = {
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
};

export const CustomModal = ({ open, onClose, children, ...props }) => (
    <Modal
        open={open}
        onClose={onClose}
        className="flex items-center justify-center outline-none"
        {...props}
    >
        <Box className="bg-white p-2 rounded-lg shadow-lg max-w-md w-full">
            {children}
        </Box>
    </Modal>
);

export const CustomBox = (props) => (
    <Box className="bg-white p-2 rounded-lg max-w-md w-full" {...props} />
);

export const CustomTypography = (props) => (
    <Typography className="!text-xl !font-bold !mb-4" {...props} />
);

export const CustomDeleteModal = ({ open, onClose, onDelete, title, message }) => (
    <Modal open={open} onClose={onClose} className="flex items-center justify-center outline-none">
        <Box className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
            <Typography variant="h6" className="text-xl font-bold mb-2">
                {title}
            </Typography>
            <Typography variant="body1" className="mb-4">
                {message}
            </Typography>
            <div className="flex justify-end mt-4">
                <OutlinedBrownButton onClick={onClose} variant="outlined" className='!mr-4'>
                    Cancel
                </OutlinedBrownButton>
                <BrownButton onClick={onDelete} variant="contained" color="error">
                    Delete
                </BrownButton>
            </div>
        </Box>
    </Modal>
);

export const BreadcrumbsComponent = ({ product }) => {
    return (
        <div className='container mx-auto px-4 max-w-5xl relative top-6 right-4'>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4, fontSize: '14px' }}>
                <Link component={RouterLink} to="/" color="inherit" underline="none" className='hover:underline cursor-pointer'>
                    <HomeIcon color="primary" />
                </Link>
                {product.category && (
                    <Link component={RouterLink} to={`/products/category/${product.category._id}`} color="inherit" underline="none" className='hover:underline cursor-pointer'>
                        {product.category.name}
                    </Link>
                )}
                {product.subcategory && (
                    <Link component={RouterLink} to={`/products/subcategory/${product.subcategory._id}`} color="inherit" underline="none" className='hover:underline cursor-pointer'>
                        {product.subcategory.name}
                    </Link>
                )}
                {product.subSubcategory && (
                    <Link component={RouterLink} to={`/products/subSubcategory/${product.subSubcategory._id}`} color="inherit" underline="none" className='hover:underline cursor-pointer'>
                        {product.subSubcategory.name}
                    </Link>
                )}
                <Typography color="text.primary" style={{ fontSize: '14px' }}>{product.name}</Typography>
            </Breadcrumbs>
        </div>
    );
};


export const ProductSkeleton = () => {
    return (
        <>
            <div className='container mx-auto px-4 max-w-5xl relative top-6 right-4'>
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4, fontSize: '14px' }}>
                    <Link component={RouterLink} to="/" color="inherit" underline="none">
                        <HomeIcon color="primary" />
                    </Link>
                    <Skeleton width={120} />
                </Breadcrumbs>
            </div>
            <div className="container mx-auto px-4 py-4 mb-8 bg-white mt-8 rounded-md max-w-5xl">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col items-center md:w-1/2">
                        <Skeleton variant="rectangular" width="100%" height={320} />
                    </div>
                    <div className="md:w-1/2">
                        <Skeleton variant="text" width="80%" height={40} />
                        <Skeleton variant="text" width="40%" height={30} style={{ marginTop: '16px' }} />
                        <Skeleton variant="text" width="60%" height={30} />
                        <Skeleton variant="text" width="20%" height={30} />
                        <div className="mt-4 flex items-center space-x-4">
                            <Skeleton variant="rectangular" width={140} height={40} />
                            <Skeleton variant="rectangular" width={60} height={40} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export const GoBackHome = () => {
    return (
        <Button
            component={RouterLink}
            to="/"
            variant="contained"
            color="primary"
            sx={{
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
            }}
        >
            <ArrowBack />
            <Typography variant="button" sx={{ color: 'white' }}>
                Go back home
            </Typography>
        </Button>
    );
};


export const NotAllowedComponent = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                <div className="mb-8 flex justify-center">
                    <img src={notAllowed} alt="Page Not Allowed" className='w-64 h-64' />
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">403</h1>
                <p className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">Page not allowed</p>
                <p className="mt-2 text-lg text-gray-600">Sorry, access to this page is not allowed.</p>
                <div className="mt-8">
                    <GoBackHome />
                </div>
            </div>
        </div>
    );
};

export const NotFoundComponent = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                <div className="mb-8 flex justify-center">
                    <img src={notFound} alt="Page Not Found" className='w-64 h-64' />
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">404</h1>
                <p className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">Page not found</p>
                <p className="mt-2 text-lg text-gray-600">Sorry, we couldn't find the page you're looking for.</p>
                <div className="mt-8">
                    <GoBackHome />
                </div>
            </div>
        </div>
    );
};


export const TabPanel = ({ children, value, index }) => {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && <Box p={3}>{children}</Box>}
        </div>
    );
};

export const DetailsBox = styled(Box)(({ theme }) => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: '5rem',
}));

export const ReviewsList = ({ reviews, openModal }) => {
    return (
        <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.length > 0 ? (
                reviews.map((review, index) => (
                    <ReviewCard
                        key={index}
                        onClick={() => openModal(review)}
                        style={{
                            cursor: 'pointer',
                            overflow: 'hidden',
                        }}
                    >
                        <Box className="flex justify-between items-center mb-2 w-52">
                            <p className='font-semibold text-lg'>{review.user.username}</p>
                            <RatingStars rating={review.rating} />
                        </Box>
                        <p className="my-2" style={{
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}>
                            {review.comment}
                        </p>
                        <Typography variant="caption" color="text.secondary">
                            {new Date(review.createdAt).toLocaleDateString()}
                        </Typography>
                    </ReviewCard>
                ))
            ) : (
                <Typography>No reviews found.</Typography>
            )}
        </Box>
    );
};

export const ReviewModal = ({ open, handleClose, selectedReview }) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="review-modal-title"
            aria-describedby="review-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '70%',
                maxWidth: '600px',
                bgcolor: 'background.paper',
                borderRadius: '8px',
                boxShadow: 24,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                outline: 'none'
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 1
                }}>
                    <Box>
                        {selectedReview && (
                            <Typography variant="caption" color="text.secondary">
                                {new Date(selectedReview.createdAt).toLocaleDateString()}
                            </Typography>
                        )}
                        <Box display="flex" alignItems="center">
                            <Typography id="review-modal-title" variant="h6" component="h2" mr={1}>
                                {selectedReview?.user.username}
                            </Typography>
                            {selectedReview && <RatingStars rating={selectedReview.rating} />}
                        </Box>
                    </Box>
                    <IconButton
                        onClick={handleClose}
                        aria-label="close"
                        sx={{ ml: 'auto', mt: -1, mr: -1 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
                {selectedReview && (
                    <Typography id="review-modal-description">
                        {selectedReview.comment}
                    </Typography>
                )}
            </Box>
        </Modal>
    );
};

export const ProductTabs = ({ value, handleChange }) => {
    return (
        <Tabs
            value={value}
            onChange={handleChange}
            aria-label="product details tabs"
            sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
            <CustomTab label="Description" />
            <CustomTab label="Details" />
            <CustomTab label="Reviews" />
        </Tabs>
    );
};

export const CustomPagination = ({ count, page, onChange, size = 'large', sx = {} }) => {
    const paginationEnabled = count > 1;

    if (!paginationEnabled) return null;

    return (
        <Stack
            spacing={2}
            sx={{
                marginTop: 4,
                alignItems: 'center',
                justifyContent: 'center',
                ...sx,
            }}
        >
            <Pagination
                count={count}
                page={page}
                onChange={onChange}
                shape="rounded"
                variant="outlined"
                size={size}
                sx={{
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
                    ...sx,
                }}
            />
        </Stack>
    );
};

export const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mb-4">
            <motion.button
                className="flex justify-between items-center w-full py-4 px-6 text-left bg-white rounded-md shadow-md hover:shadow-lg transition-shadow duration-200"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={isOpen ? {} : { scale: 1.02 }}
                whileTap={isOpen ? {} : { scale: 0.98 }}
            >
                <span className="flex items-center text-brown-800 font-semibold">
                    <QuestionAnswerOutlined className="mr-2 text-brown-600" />
                    {question}
                </span>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ExpandMore className="text-brown-600" />
                </motion.span>
            </motion.button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-b-md shadow-md mt-1 overflow-hidden"
                    >
                        <div className="p-6 text-brown-700">
                            <p>{answer}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const GoBackArrow = () => {
    return (
        <div className="flex justify-start">
            <ChevronLeft className="text-stone-600" />
        </div>
    )
}

export const GoBackButton = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    }

    return (
        <div className="flex justify-left mb-4">
            <RoundIconButton
                className="text-black rounded-md px-4 py-2"
                onClick={goBack}
            >
                <GoBackArrow />
            </RoundIconButton>
        </div>
    )
}

export const FAQSection = () => {
    const [faqData, setFaqData] = useState([]);
    const axiosInstance = useAxios();

    useEffect(() => {
        const fetchFAQs = async () => {
            try {
                const response = await axiosInstance.get('/faq/get');
                setFaqData(response.data);
            } catch (error) {
                console.error('Error fetching FAQs:', error);
            }
        };

        fetchFAQs();
    }, []);

    return (
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-brown-50 mt-10">
            <GoBackButton />
            <h1 className="text-3xl font-bold text-stone-600 mb-8 text-left">Frequently Asked Questions</h1>

            <div>
                {faqData.map((faq, index) => (
                    <FAQItem key={index} question={faq.question} answer={faq.answer} />
                ))}
            </div>
        </div>
    );
};

export default FAQSection;

export const CheckoutButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#686159',
    color: 'white',
    fontSize: '1.02rem',
    padding: '4px 20px',
    '&:hover': {
        backgroundColor: '#5b504b',
    },
}));

export const IncreaseButton = styled(Button)(({ theme }) => ({
    minWidth: '35px',
    height: '30px',
    backgroundColor: '#686159',
    color: 'white',
    '&:hover': {
        backgroundColor: '#5b504b',
    },
}));

export const DecreaseButton = styled(Button)(({ theme }) => ({
    minWidth: '35px',
    height: '30px',
    backgroundColor: '#686159',
    color: 'white',
    '&:hover': {
        backgroundColor: '#5b504b',
    },
}));

export const LoadingCart = () => {
    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-2 mb-16 bg-gray-50 mt-10">
                <h1 className="text-2xl font-semibold mb-4">Cart</h1>
                <TableContainer component={Paper} className="bg-white">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><Skeleton variant="text" animation="wave" width={100} height={20} /></TableCell>
                                <TableCell align="center"><Skeleton variant="text" animation="wave" width={80} height={20} /></TableCell>
                                <TableCell align="center"><Skeleton variant="text" animation="wave" width={80} height={20} /></TableCell>
                                <TableCell align="center"><Skeleton variant="text" animation="wave" width={80} height={20} /></TableCell>
                                <TableCell align="center"><Skeleton variant="text" animation="wave" width={40} height={20} /></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.from(new Array(5)).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <Skeleton variant="rectangular" width={80} height={80} className="mr-4" />
                                            <Skeleton variant="text" animation="wave" width={120} height={20} />
                                        </div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Skeleton variant="text" animation="wave" width={60} height={20} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Skeleton variant="text" animation="wave" width={60} height={20} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Skeleton variant="text" animation="wave" width={60} height={20} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Skeleton variant="text" animation="wave" width={30} height={20} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <Footer />
        </>
    );
}

export const ProductItemSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col">
            <div className="relative mb-2">
                <Skeleton variant="rectangular" animation="wave" width="100%" height={192} />
            </div>
            <Skeleton variant="text" animation="wave" width="80%" height={24} className="mt-2" />
            <div className="flex flex-col mb-2">
                <Skeleton variant="text" animation="wave" width="60%" height={28} className="mt-1" />
            </div>
            <div className="flex justify-between items-center mt-auto">
                <Skeleton variant="rectangular" animation="wave" width={140} height={40} />
                <Skeleton variant="rectangular" animation="wave" width={60} height={40} />
            </div>
        </div>
    );
};

export const EmptyCart = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="flex flex-col items-center justify-center bg-white p-8 rounded-sm shadow-sm">
                <img src={emptyCartImage} alt="Empty Cart" className="w-60 h-60 object-cover mb-4" />
                <p className="text-sm font-semibold mb-2">Your cart is empty!</p>
                <h2
                    className='text-base font-semibold cursor-pointer hover:underline'
                    onClick={() => navigate('/')}
                >
                    Go Back to Home
                </h2>
            </div>
        </>
    )
}

export const EmptyWishlist = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="flex flex-col items-center justify-center bg-white p-8 rounded-sm shadow-sm">
                <img src={emptyWishlistImage} alt="Empty Wishlist" className="w-60 h-60 object-cover mb-4" />
                <p className="text-sm font-semibold mb-2">Your wishlist is empty!</p>
                <h2
                    className='text-base font-semibold cursor-pointer hover:underline'
                    onClick={() => navigate('/')}
                >
                    Go Back to Home
                </h2>
            </div>
        </>
    )
}