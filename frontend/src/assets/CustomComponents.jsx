import {
    ArrowBack,
    ChevronLeft,
    Close,
    CreateOutlined,
    DashboardOutlined,
    DeleteOutline,
    DeleteOutlined,
    ExpandLess,
    ExpandMore,
    FavoriteBorderOutlined,
    InboxOutlined,
    Login,
    Logout,
    Menu as MenuIcon,
    MoreVert,
    PersonOutlined,
    QuestionAnswerOutlined,
    Search,
    Settings,
    Share,
    ShoppingCart,
    ShoppingCartOutlined,
    Star,
    StarBorder
} from '@mui/icons-material';
import {
    Badge,
    Box,
    Breadcrumbs,
    Button,
    CircularProgress,
    Collapse,
    FormControl,
    IconButton,
    InputAdornment,
    Link,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
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
    Toolbar,
    Tooltip,
    Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SvgIcon from '@mui/material/SvgIcon';
import { GridToolbar } from '@mui/x-data-grid';
import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import useAxios from '../axiosInstance';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar/Navbar';
import logo from './img/logo.png';

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
    transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
    '&:hover': {
        backgroundColor: '#686159',
        color: 'white',
        '& .MuiSvgIcon-root': {
            color: 'white',
            transition: 'color 0.3s ease-in-out',
        },
    },
    flexGrow: 1,
    marginRight: theme.spacing(2),
}));

export const WishlistButton = styled(Button)(({ theme }) => ({
    color: '#493c30',
    backgroundColor: '#f7f7f7',
    transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
    '&:hover': {
        borderColor: '#5b504b',
        backgroundColor: '#e0e0e0',
        color: '#686159',
        transition: 'color 0.3s ease-in-out',
    },
    flexShrink: 0,
}));

export const BrownShoppingCartIcon = styled(ShoppingCart)(({ theme }) => ({
    color: '#57534E',
    marginRight: 20,
    transition: 'color 0.3s ease',
}));

export const CartButton = () => {
    return (
        <>
            <BrownShoppingCartIcon />
            Add To Cart
        </>
    )
}

export const CartWishlistButtons = ({ handleAction, isCartLoading, isWishlistLoading }) => {
    return (
        <>
            <AddToCartButton onClick={handleAction('cart')} disabled={isCartLoading || isWishlistLoading}>
                <CartButton />
            </AddToCartButton>
            <WishlistButton onClick={handleAction('wishlist')} disabled={isCartLoading || isWishlistLoading}>
                <FavoriteBorderOutlined />
            </WishlistButton>
        </>
    );
};

export const DetailsAddToCartButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#686159',
    color: 'white',
    transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
    '& .MuiSvgIcon-root': {
        color: 'white',
        transition: 'color 0.3s ease-in-out',
    },
    '&:hover': {
        backgroundColor: '#4c4844',
        color: 'white',
        '& .MuiSvgIcon-root': {
            color: 'white',
        },
    },
    flexGrow: 1,
    marginRight: theme.spacing(2),
}));

export const DetailsWishlistButton = styled(Button)(({ theme }) => ({
    color: '#493c30',
    backgroundColor: '#f7f7f7',
    width: '150px',
    transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
    '&:hover': {
        borderColor: '#5b504b',
        backgroundColor: '#e0e0e0',
        color: '#686159',
        transition: 'color 0.3s ease-in-out',
    },
    flexShrink: 0,
}));


export const DetailsCartWishlistButtons = ({ handleAction, isCartLoading, isWishlistLoading }) => {
    return (
        <>
            <DetailsAddToCartButton onClick={handleAction('cart')} disabled={isCartLoading || isWishlistLoading}>
                <CartButton />
            </DetailsAddToCartButton>
            <DetailsWishlistButton onClick={handleAction('wishlist')} disabled={isCartLoading || isWishlistLoading}>
                <FavoriteBorderOutlined />
            </DetailsWishlistButton>
        </>
    );
};

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
    boxShadow: theme.shadows[2],
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

export const DashboardTableStyling = {
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
};

export const CustomModal = ({ open, onClose, children, ...props }) => (
    <Modal
        open={open}
        onClose={onClose}
        className="flex items-center justify-center"
        {...props}
    >
        <Box className="bg-white p-2 rounded-lg shadow-lg max-w-md w-full focus:outline-none">
            {children}
        </Box>
    </Modal>
);

export const CustomBox = (props) => (
    <Box className="bg-white p-2 rounded-lg max-w-md w-full focus:outline-none" {...props} />
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


export const ProductDetailsSkeleton = () => {
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

            <div className="container mx-auto px-4 py-4 mb-8 bg-white mt-8 rounded-md max-w-5xl">

                <div className="mt-8">
                    <Tabs
                        value={0}
                        aria-label="product details tabs"
                        sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mb: 2 }}
                    >
                        <Skeleton variant="rectangular" width="100%" height={40} style={{ margin: '0 4px', flexGrow: 1 }} />
                        <Skeleton variant="rectangular" width="100%" height={40} style={{ margin: '0 4px', flexGrow: 1 }} />
                        <Skeleton variant="rectangular" width="100%" height={40} style={{ margin: '0 4px', flexGrow: 1 }} />
                    </Tabs>

                    <Box p={3}>
                        <Skeleton variant="text" width="80%" height={30} />
                        <Skeleton variant="text" width="60%" height={30} style={{ marginTop: '16px' }} />
                        <Skeleton variant="text" width="40%" height={30} style={{ marginTop: '16px' }} />
                    </Box>
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

export const ErrorPageComponent = ({ errorType, imageSrc }) => {
    const errorMessages = {
        403: {
            title: "403",
            subtitle: "Page not allowed",
            description: "Sorry, access to this page is not allowed."
        },
        404: {
            title: "404",
            subtitle: "Page not found",
            description: "Sorry, we couldn't find the page you're looking for."
        }
    };

    const { title, subtitle, description } = errorMessages[errorType] || errorMessages[404];

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                <div className="mb-8 flex justify-center">
                    <img src={imageSrc} alt={subtitle} className='w-64 h-64' />
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">{title}</h1>
                <p className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">{subtitle}</p>
                <p className="mt-2 text-lg text-gray-600">{description}</p>
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
        <Box className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4">
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
                        <Box className="flex justify-between items-center w-52">
                            <p className='font-semibold text-lg mr-4'>
                                {`${review.user.firstName}`}
                            </p>
                            <RatingStars rating={review.rating} />
                        </Box>
                        <p className="font-semibold" style={{
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            {review.title}
                        </p>
                        <p style={{
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}>
                            {review.comment}
                        </p>
                        <Typography variant="caption" color="text.secondary">
                            {new Date(review.updatedAt || review.createdAt).toLocaleDateString()}
                        </Typography>
                    </ReviewCard>
                ))
            ) : (
                <Typography>No reviews found.</Typography>
            )}
        </Box >
    );
};

export const ReviewModal = ({ open, handleClose, selectedReview, onImageClick }) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="review-modal-title"
            aria-describedby="review-modal-description"
        >
            <Box sx={{
                position: 'relative',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
                maxWidth: '800px',
                bgcolor: 'background.paper',
                borderRadius: '8px',
                boxShadow: 24,
                display: 'flex',
                flexDirection: 'column',
                p: 2,
                outline: 'none',
            }}>
                {selectedReview && selectedReview.user && (
                    <Box sx={{ display: 'flex', flex: 1 }}>
                        <Box sx={{
                            width: '40%',
                            flexShrink: 0,
                            mr: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <img
                                src={`http://localhost:5000/${selectedReview.product.image}`}
                                alt={selectedReview.product.name}
                                onClick={() => onImageClick(selectedReview.product._id)}
                                className="w-full h-auto object-cover rounded-md cursor-pointer"
                            />
                        </Box>
                        <Box sx={{
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Box>
                                        <Typography id="review-modal-title" variant="h6" component="h2" mb={1} className="break-words">
                                            {selectedReview.user.firstName} {selectedReview.user.lastName}
                                            <Typography variant="caption" color="text.secondary" component="span" sx={{ ml: 1 }}>
                                                {new Date(selectedReview.updatedAt || selectedReview.createdAt).toLocaleDateString()}
                                            </Typography>
                                            <RatingStars rating={selectedReview.rating} />
                                        </Typography>
                                    </Box>
                                    <Typography variant="h6" component="h2" display="flex" alignItems="center" className="break-words">
                                        <span style={{ maxWidth: 'calc(100% - 120px)' }}>
                                            {selectedReview.product.name}
                                        </span>
                                    </Typography>

                                    <p className="font-semibold mt-1 break-words">
                                        {selectedReview.title}
                                    </p>
                                    <textarea
                                        value={selectedReview.comment}
                                        readOnly
                                        className="custom-textarea break-words"
                                        style={{
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
                                        }}
                                        onFocus={(e) => e.target.style.border = 'none'}
                                    />
                                </Box>
                            </Box>
                            <Box sx={{ marginTop: 'auto' }} />
                            <IconButton
                                onClick={handleClose}
                                aria-label="close"
                                sx={{ position: 'absolute', top: 8, right: 8 }}
                            >
                                <Close />
                            </IconButton>
                        </Box>
                    </Box>
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
                const response = await axiosInstance.get('/faqs/get');
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

export const LoadingCart = () => {
    return (
        <>
            <Navbar />
            <div className="container mx-auto px-24 py-2 mb-16 bg-gray-50 mt-10 flex">
                <div className="flex-1">
                    <h1 className="text-2xl font-semilight mb-4">Cart</h1>
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
                                {Array.from(new Array(3)).map((_, index) => (
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
                {/* Summary Section Loading Animation */}
                <div className="ml-6 w-80 mt-12">
                    <Paper className="p-4">
                        <h2 className="text-xl font-semibold mb-2"><Skeleton variant="text" animation="wave" width={100} height={24} /></h2>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell><Skeleton variant="text" animation="wave" width={80} height={20} /></TableCell>
                                    <TableCell align="right"><Skeleton variant="text" animation="wave" width={60} height={20} /></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><Skeleton variant="text" animation="wave" width={80} height={20} /></TableCell>
                                    <TableCell align="right"><Skeleton variant="text" animation="wave" width={60} height={20} /></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><Skeleton variant="text" animation="wave" width={80} height={20} /></TableCell>
                                    <TableCell align="right"><Skeleton variant="text" animation="wave" width={60} height={20} /></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><Skeleton variant="text" animation="wave" width={80} height={20} /></TableCell>
                                    <TableCell align="right"><Skeleton variant="text" animation="wave" width={60} height={20} /></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <div className="mt-4 w-full">
                            <Skeleton variant="rectangular" width={280} height={40} />
                        </div>
                    </Paper>
                </div>
            </div>
            <Footer />
        </>
    );
};


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
                <Skeleton variant="rectangular" animation="wave" width={170} height={40} className='rounded' />
                <Skeleton variant="rectangular" animation="wave" width={60} height={40} className='rounded' />
            </div>
        </div>
    );
};

export const ReviewItemSkeleton = () => (
    <div className="relative p-4 mb-4 bg-white rounded-md shadow-sm">
        <div className="absolute top-4 right-4">
            <Skeleton variant="circular" animation="wave" width={24} height={24} />
        </div>

        <div className="flex flex-grow">
            <div className="flex-shrink-0 mr-4">
                <Skeleton variant="rectangular" animation="wave" width={80} height={80} className="rounded-md" />
            </div>

            <div className="flex-grow">
                <div className="flex items-center mb-2">
                    <Skeleton variant="text" animation="wave" width={200} height={28} className="mr-2" />
                    <Skeleton variant="text" animation="wave" width={100} height={28} />
                </div>

                <div className="mb-1">
                    <Skeleton variant="text" animation="wave" width={180} height={24} />
                </div>
                <Skeleton variant="text" animation="wave" width={150} height={20} className="mt-1" />
                <Skeleton variant="text" animation="wave" width={50} height={20} className="mt-1" />
            </div>
        </div>
    </div>
);

export const ProfileInformationSkeleton = () => {
    return (
        <div className="space-y-2">
            <Box className="flex gap-4">
                <Skeleton variant="text" animation="wave" width="100%" height={56} />
                <Skeleton variant="text" animation="wave" width="100%" height={56} />
            </Box>

            <Box className="flex gap-4">
                <Skeleton variant="rectangular" animation="wave" width="100%" height={56} />
                <Skeleton variant="rectangular" animation="wave" width="100%" height={56} />
            </Box>

            <Skeleton variant="rectangular" animation="wave" width={120} height={48} />
        </div>
    );
};

export const AddressInformationSkeleton = () => {
    return (
        <div className='space-y-0'>
            <div className="flex gap-3">
                <div className="flex-1">
                    <Skeleton variant="text" animation="wave" width="100%" height={80} />
                </div>
                <div className="flex-1">
                    <Skeleton variant="text" animation="wave" width="100%" height={80} />
                </div>
                <div className="flex-1">
                    <Skeleton variant="text" animation="wave" width="100%" height={80} />
                </div>
            </div>
            <div className="flex gap-3">
                <div className="flex-1">
                    <Skeleton variant="text" animation="wave" width="100%" height={80} className='rounded' />
                </div>
                <div className="flex-1">
                    <Skeleton variant="text" animation="wave" width="100%" height={80} className='rounded' />
                </div>
            </div>
            <Skeleton variant="text" animation="wave" width={100} height={50} className='rounded' />
        </div>
    );
};

export const EmptyState = ({
    imageSrc,
    message,
    subMessage = '',
    dynamicValue = '',
    buttonText = 'Go Back to Home',
    containerClass = 'p-8',
    imageClass = 'w-60 h-60'
}) => {
    const navigate = useNavigate();

    return (
        <div className={`flex flex-col items-center justify-center bg-white rounded-sm shadow-sm ${containerClass}`}>
            <img src={imageSrc} alt={message} className={`${imageClass} object-cover mb-4`} />
            <p className="text-sm font-semibold mb-2">
                {message} {dynamicValue && <span>{dynamicValue}</span>}
            </p>
            {subMessage && <h1 className="text-sm font-semibold mb-2">{subMessage}</h1>}
            <h2
                className="text-base font-semibold cursor-pointer hover:underline"
                onClick={() => navigate('/')}
            >
                {buttonText}
            </h2>
        </div>
    );
};

EmptyState.propTypes = {
    imageSrc: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    subMessage: PropTypes.string,
    dynamicValue: PropTypes.string,
    buttonText: PropTypes.string,
    containerClass: PropTypes.string,
    imageClass: PropTypes.string,
};

export const truncateText = (text, maxLength) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

export const CustomReviewCard = ({ review, onImageClick, onMenuClick, onCardClick }) => {
    const handleProductClick = (event, productId) => {
        event.stopPropagation();
        onImageClick(productId);
    };

    return (
        <div
            className="p-4 mb-4 shadow-sm flex relative cursor-pointer bg-white rounded-md"
            onClick={() => onCardClick(review)}
            style={{ height: 'auto', minHeight: '120px' }}
        >
            <Box className="flex-shrink-0 mr-4">
                <img
                    src={`http://localhost:5000/${review.product.image}`}
                    alt={review.product.name}
                    onClick={(event) => handleProductClick(event, review.product._id)}
                    className="w-20 h-20 object-cover rounded-md cursor-pointer hover:underline"
                />
            </Box>
            <Box flexGrow={1} display="flex" flexDirection="column" justifyContent="space-between" alignItems="flex-start">
                <Box>
                    <Typography
                        onClick={(event) => handleProductClick(event, review.product._id)}
                        variant="h6"
                        className="font-light mb-2 flex items-center ml-2 hover:underline break-words"
                    >
                        {truncateText(review.product.name, 20)}
                        <Box className='ml-2'>
                            <RatingStars rating={review.rating} />
                        </Box>
                    </Typography>
                    <p className="text-base font-semibold break-words">
                        {truncateText(review.title, 100)}
                    </p>
                    <div className="mt-1 text-gray-700 break-words">
                        <Typography variant="body1" className="break-words">
                            {truncateText(review.comment, 70)}
                        </Typography>
                    </div>

                    <Typography variant="caption" className="block mt-2 text-sm text-gray-500">
                        {new Date(review.updatedAt || review.createdAt).toLocaleDateString()}
                    </Typography>
                </Box>
                <CenteredMoreVertIcon onClick={(event) => onMenuClick(event, review)} className="absolute top-2 right-2" />
            </Box>
        </div>
    );
};

export const CenteredMoreVertIcon = ({ onClick, ...props }) => (
    <Box display="flex" justifyContent="center" alignItems="center" {...props}>
        <IconButton onClick={onClick}>
            <MoreVert />
        </IconButton>
    </Box>
);


export const CustomMenu = ({
    anchorEl,
    open,
    handleMenuClose,
    handleEditClick,
    handleDeleteClick,
}) => {
    return (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
                sx: {
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                    transform: 'translate(-10px, 10px)',
                },
            }}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
        >
            <MenuItem onClick={handleEditClick}>Edit</MenuItem>
            <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
        </Menu>
    );
};

export const SearchBarInput = ({ searchTerm, handleInputChange, handleSubmit }) => {
    return (
        <TextField
            value={searchTerm}
            onChange={handleInputChange}
            placeholder='Search products...'
            variant="outlined"
            autoComplete="off"
            sx={{
                width: '400px',
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
            }}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            onClick={handleSubmit}
                            edge="end"
                            aria-label="search"
                        >
                            <Search color='primary' />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
};

export const ShareWishlist = ({ handleShareWishlist, loading }) => {
    return (
        <Button
            startIcon={<Share />}
            onClick={handleShareWishlist}
            disabled={loading}
        >
            Share Wishlist
        </Button>
    )
}

export const ClearWishlist = ({ setIsModalOpen, loading }) => {
    return (
        <Tooltip title="Clear wishlist" arrow placement="top">
            <RoundIconButton
                onClick={() => setIsModalOpen(true)}
                disabled={loading}
                className="cursor-pointer"
            >
                <DeleteOutline color="primary" />
            </RoundIconButton>
        </Tooltip>
    )
}

export const Header = ({
    title,
    wishlistItems,
    setIsModalOpen,
    handleShareWishlist,
    loading,
    fullName = '',
}) => {
    const isSharedWishlist = fullName.trim() !== '';

    return (
        <div className="bg-white p-4 rounded-sm shadow-sm mb-3 flex justify-between items-center">
            <Typography variant="h5" className="text-gray-800 font-semilight">
                {isSharedWishlist ? `${fullName}'s Wishlist` : title}
            </Typography>
            {wishlistItems !== undefined && !isSharedWishlist ? (
                <div className="flex space-x-2">
                    {wishlistItems.length > 0 && (
                        <>
                            <ShareWishlist handleShareWishlist={handleShareWishlist} loading={loading} />
                            <ClearWishlist setIsModalOpen={setIsModalOpen} loading={loading} />
                        </>
                    )}
                </div>
            ) : null}
        </div>
    );
};

export const pluralize = (word, count) => {
    if (count === 1) return word;
    return word.endsWith('y') ? `${word.slice(0, -1)}ies` : `${word}s`;
};

export const DashboardHeader = ({
    title,
    selectedItems,
    setAddItemOpen,
    setDeleteItemOpen,
    itemName
}) => {
    const isMultipleSelected = selectedItems.length > 1;
    const itemNamePlural = pluralize(itemName, selectedItems.length);

    return (
        <div className='bg-white p-4 flex items-center justify-between w-full mb-4 rounded-md'>
            <Typography variant='h5'>{title}</Typography>
            <div>
                <OutlinedBrownButton onClick={() => setAddItemOpen(true)} className='!mr-4'>
                    Add {itemName}
                </OutlinedBrownButton>
                {selectedItems.length > 0 && (
                    <OutlinedBrownButton
                        onClick={() => setDeleteItemOpen(true)}
                        disabled={selectedItems.length === 0}
                    >
                        {isMultipleSelected ? `Delete ${itemNamePlural}` : `Delete ${itemName}`}
                    </OutlinedBrownButton>
                )}
            </div>
        </div>
    );
};


export const SearchDropdown = ({ results, onClickSuggestion, searchBarWidth }) => {
    return (
        <List
            sx={{
                position: 'absolute',
                width: searchBarWidth,
                bgcolor: 'background.paper',
                boxShadow: 1,
                borderRadius: 1,
                maxHeight: '200px',
                overflowY: 'auto',
                zIndex: 99,
                top: '41px',
            }}
        >
            {results.map((result) => (
                <ListItem
                    key={result._id}
                    button
                    onClick={() => onClickSuggestion(result._id)}
                >
                    <img
                        src={`http://localhost:5000/${result.image}`}
                        alt={result.name}
                        style={{
                            width: '40px',
                            height: '40px',
                            marginLeft: '-10px',
                            marginRight: '10px',
                            objectFit: 'cover',
                        }}
                    />
                    <ListItemText
                        primary={result.name}
                        secondary={
                            <Typography component="span" variant="body2" color="text.secondary">
                                {result.salePrice ? (
                                    <>
                                        <span style={{ textDecoration: 'line-through', marginRight: '8px' }}>
                                            €{result.price}
                                        </span>
                                        <span className='font-bold'>€{result.salePrice}</span>
                                    </>
                                ) : (
                                    `€${result.price}`
                                )}
                            </Typography>
                        }
                    />
                </ListItem>
            ))}
        </List>
    );
};

export const ProfileDropdown = ({ isAdmin, handleLogout }) => {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <div
            className="absolute right-0 mt-1 w-48 bg-white border shadow-lg rounded-lg p-2"
            tabIndex="0"
        >
            {isAdmin && (
                <>
                    <button
                        onClick={() => handleNavigate('/dashboard/users')}
                        className="flex items-center px-2 py-2 mb-2 text-stone-700 hover:bg-stone-100 no-underline w-full text-left"
                    >
                        <StyledDashboardIcon className="mr-2" />
                        Dashboard
                    </button>
                    <hr className='border-stone-200 mb-2' />
                </>
            )}
            <button
                onClick={() => handleNavigate('/profile/me')}
                className="flex items-center px-2 py-2 text-stone-700 hover:bg-stone-100 no-underline w-full text-left"
            >
                <StyledPersonIcon className="mr-2" />
                Profile
            </button>
            <button
                onClick={() => handleNavigate('/profile/orders')}
                className="flex items-center px-2 py-2 text-stone-700 hover:bg-stone-100 no-underline w-full text-left"
            >
                <StyledInboxIcon className="mr-2" />
                Orders
            </button>
            <button
                onClick={() => handleNavigate('/profile/wishlist')}
                className="flex items-center px-2 py-2 mb-2 text-stone-700 hover:bg-stone-100 no-underline w-full text-left"
            >
                <StyledFavoriteIcon className="mr-2" />
                Wishlist
            </button>
            <hr className='border-stone-200 mb-2' />
            <button
                onClick={handleLogout}
                className="flex items-center w-full px-2 py-2 text-stone-700 hover:bg-stone-100 text-left"
            >
                <StyledLogoutIcon className="mr-2" />
                Log Out
            </button>
        </div>
    );
};

export const CartDropdown = ({
    cartItems,
    cartTotal,
    handleRemoveItem,
    handleGoToCart,
    isLoading,
    handleProductClick
}) => (
    <div
        className="absolute right-0 mt-1 w-96 bg-white border shadow-lg rounded-lg p-4"
        tabIndex="0"
    >
        {cartItems.length === 0 ? (
            <div className="text-sm text-left">You have no products in your cart</div>
        ) : (
            <>
                <ul className="mt-2 mb-4">
                    {cartItems.map(item => (
                        <li
                            key={`${item.product._id}-${item.quantity}`}
                            className={'flex justify-between items-center mb-4'}
                        >
                            <img
                                src={`http://localhost:5000/${item.product.image}`}
                                alt={item.product.name}
                                className="w-12 h-12 object-cover rounded cursor-pointer"
                                onClick={() => handleProductClick(item.product._id)}
                            />
                            <div className="ml-2 flex-grow">
                                <span
                                    className="block font-semibold cursor-pointer hover:underline truncate max-w-[calc(22ch)]"
                                    onClick={() => handleProductClick(item.product._id)}
                                >
                                    {item.product.name}
                                </span>
                                <span className="block text-sm text-gray-500">
                                    {item.quantity} x {item.product.salePrice > 0 ? item.product.salePrice : item.product.price} €
                                </span>
                            </div>
                            <RoundIconButton
                                style={{ backgroundColor: 'white' }}
                                onClick={() => handleRemoveItem(item.product._id)}
                                disabled={isLoading}
                            >
                                <BrownDeleteOutlinedIcon />
                            </RoundIconButton>
                        </li>
                    ))}
                </ul>
                <hr className='border-stone-200' />
                <div className="flex justify-between items-center mt-4 mb-4">
                    <div className="flex justify-start items-center space-x-1">
                        <span className="font-semibold">Total:</span>
                        <span className="font-semibold">{cartTotal.toFixed(2)} €</span>
                    </div>
                </div>
                <Button
                    style={{ backgroundColor: '#686159', color: 'white' }}
                    onClick={handleGoToCart}
                    className='w-full rounded-md'
                    disabled={isLoading}
                >
                    Go to Cart
                </Button>
            </>
        )}
    </div>
);

export const LoadingOverlay = () => (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50">
        <CircularProgress size={60} style={{ color: '#373533' }} />
    </div>
);

export const NavbarLogo = ({ dashboardStyling }) => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    }

    return (
        <div onClick={handleGoHome}>
            <Tooltip title="Home" arrow>
                <button
                    onClick={handleGoHome}
                    className={`flex items-center cursor-pointer ${dashboardStyling || ''}`}
                >
                    <img src={logo} alt="Logo" className="h-9" />
                </button>
            </Tooltip>
        </div>
    );
}

export const ProfileIcon = ({ auth, handleProfileDropdownToggle }) => {
    return (
        <Tooltip title="Profile" arrow>
            <div className="flex items-center">
                <ProfileButton
                    onMouseDown={handleProfileDropdownToggle}
                    className="flex items-center space-x-2 rounded-sm"
                >
                    <StyledPersonIcon />
                    {auth?.firstName && (
                        <span className="ml-2 text-sm">{auth.firstName}</span>
                    )}
                </ProfileButton>
            </div>
        </Tooltip>
    );
};

export const WishlistIcon = () => {
    const navigate = useNavigate();

    const handleWishlistClick = () => {
        navigate('/profile/wishlist');
    };

    return (
        <RoundIconButton onClick={handleWishlistClick}>
            <StyledFavoriteIcon />
        </RoundIconButton>
    );
};

export const CartIcon = ({ totalQuantity, handleCartDropdownToggle }) => {
    return (
        <RoundIconButton aria-label="cart" onMouseDown={handleCartDropdownToggle}>
            <Badge
                badgeContent={totalQuantity}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                color="secondary"
                showZero
            >
                <StyledShoppingCartIcon />
            </Badge>
        </RoundIconButton>
    );
};


export const CollapseIcon = ({ toggleDrawer }) => {
    return (
        <Tooltip title="Collapse" arrow>
            <IconButton onClick={toggleDrawer}>
                <ChevronLeft />
            </IconButton>
        </Tooltip>
    );
}

export const ExtendIcon = ({ toggleDrawer, open }) => {
    return (
        <Tooltip title="Extend" arrow>
            <IconButton
                edge="start"
                color="primary"
                aria-label="open drawer"
                onClick={toggleDrawer}
                className='mr-36'
                sx={{ ...(open && { display: 'none' }) }}
            >
                <MenuIcon />
            </IconButton>
        </Tooltip>
    )
}

export const DashboardCollapse = ({ toggleDrawer }) => {
    return (
        <Toolbar
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                px: [1],
            }}
        >
            <CollapseIcon toggleDrawer={toggleDrawer} />
        </Toolbar>
    )
}

export const DropdownMenu = ({ auth, isAdmin, onLogout }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleDropdownToggle = () => {
        setIsDropdownOpen(prev => !prev);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative ml-4" ref={dropdownRef}>
            <Tooltip title="Profile" arrow>
                <div onClick={handleDropdownToggle} className="flex items-center cursor-pointer">
                    <StyledPersonIcon />
                    {auth.firstName && (
                        <span className="ml-2 text-sm">{auth.firstName}</span>
                    )}
                </div>
            </Tooltip>

            {isDropdownOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white border shadow-lg rounded-lg p-2">
                    {isAdmin() && (
                        <>
                            <Link to="/dashboard/users" className="flex items-center px-2 py-2 mb-2 text-stone-700 hover:bg-stone-100">
                                <StyledDashboardIcon className="mr-2" />
                                Dashboard
                            </Link>
                            <div className="border-t border-stone-200 mb-2"></div>
                        </>
                    )}
                    <Link to="/profile" className="flex items-center px-2 py-2 text-stone-700 hover:bg-stone-100">
                        <StyledPersonIcon className="mr-2" />
                        Profile
                    </Link>
                    <Link to="/orders" className="flex items-center px-2 py-2 text-stone-700 hover:bg-stone-100">
                        <StyledInboxIcon className="mr-2" />
                        Orders
                    </Link>
                    <Link to="/wishlist" className="flex items-center px-2 py-2 mb-2 text-stone-700 hover:bg-stone-100">
                        <StyledFavoriteIcon className="mr-2" />
                        Wishlist
                    </Link>
                    <div className="border-t border-stone-200 mb-2"></div>
                    <button onClick={onLogout} className="flex items-center w-full px-2 py-2 text-stone-700 hover:bg-stone-100 text-left">
                        <StyledLogoutIcon className="mr-2" />
                        Log Out
                    </button>
                </div>
            )}
        </div>
    );
};

export const AuthActions = ({
    auth,
    isDropdownOpen,
    handleProfileDropdownToggle,
    handleLogout,
    isAdmin
}) => {

    const navigate = useNavigate();

    return (
        <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
                {auth.accessToken ? (
                    <div className="relative ml-4">
                        <ProfileIcon
                            auth={auth}
                            handleProfileDropdownToggle={handleProfileDropdownToggle}
                        />
                        {isDropdownOpen && (
                            <ProfileDropdown
                                isAdmin={isAdmin}
                                handleLogout={handleLogout}
                            />
                        )}
                    </div>
                ) : (
                    <>
                        <RoundIconButton
                            onClick={() => navigate('/login')}
                            sx={{ color: '#686159' }}
                        >
                            <Login />
                        </RoundIconButton>
                    </>
                )}
            </div>
        </div>
    );
};

export const DashboardAppBar = ({ open, children }) => {
    return (
        <AppBar
            position="absolute"
            open={open}
            sx={{
                boxShadow: '1px 0px 3px rgba(0, 0, 0, 0.1)',
                display: 'flex',
            }}
        >
            {children}
        </AppBar>
    );
};

export const DashboardToolbar = ({ children }) => {
    return (
        <Toolbar
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            {children}
        </Toolbar>
    )
}

export const DashboardNavbar = ({ open, toggleDrawer, auth, isDropdownOpen, handleProfileDropdownToggle, handleLogout, isAdmin }) => {
    return (
        <DashboardAppBar open={open}>
            <DashboardToolbar>
                <ExtendIcon toggleDrawer={toggleDrawer} open={open} />

                <div className="flex justify-between items-center top-0 left-0 right-0 z-50 mx-auto-xl px-20 w-full">
                    <div className="flex items-center mb-5">
                        <NavbarLogo dashboardStyling={'relative top-2'} />
                    </div>

                    <AuthActions
                        auth={auth}
                        isDropdownOpen={isDropdownOpen}
                        handleProfileDropdownToggle={handleProfileDropdownToggle}
                        handleLogout={handleLogout}
                        isAdmin={isAdmin}
                    />
                </div>
            </DashboardToolbar>
        </DashboardAppBar>
    )
}

export const knownEmailProviders = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'icloud.com',
    'mail.com',
    'aol.com',
    'zoho.com',
    'protonmail.com',
    'yandex.com',
    'fastmail.com',
    'gmx.com',
    'tutanota.com',
    'hushmail.com',
    'live.com',
    'me.com',
    'msn.com',
    'webmail.com',
    'front.com',
    'rediffmail.com',
    'cogeco.ca',
    'comcast.net',
    'verizon.net',
    'btinternet.com',
    'bellsouth.net',
    'sbcglobal.net',
    'blueyonder.co.uk',
    'charter.net',
    'earthlink.net',
    'optimum.net',
    'xfinity.com',
    'freenet.de',
    'mail.ru',
    'sina.com',
    'qq.com',
    '163.com',
    '126.com',
    'aliyun.com',
    '126.com',
    'example',
    'test',
    'custommail'
];