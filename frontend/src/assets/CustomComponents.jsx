import {
    ArrowBack,
    ArrowBackIosNew,
    ArrowForwardIos,
    ChevronLeft,
    Close,
    CreateOutlined,
    DashboardOutlined,
    Delete,
    DeleteOutline,
    DeleteOutlined,
    ExpandLess,
    ExpandMore,
    Favorite,
    FavoriteBorderOutlined,
    Home,
    HomeOutlined,
    Inbox,
    InboxOutlined,
    Login,
    Logout,
    Menu as MenuIcon,
    MoreVert,
    MoveToInbox,
    MoveToInboxOutlined,
    Person,
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
    InputLabel,
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
    PaginationItem,
    Paper,
    Select,
    Skeleton,
    Stack,
    SvgIcon,
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
    useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { GridToolbar } from '@mui/x-data-grid';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAxios from '../axiosInstance';
import Navbar from '../components/Navbar/Navbar';
import { getImageUrl } from '../config';
import logo from './img/brand/logo.png';
import {
    customMenuProps,
    filterLayoutStyling,
    getExpandIconProps,
    getMotionDivProps,
    goBackButtonStyling,
    headerFilterStyling,
    headerSearchStyling,
    layoutContainerStyle,
    paginationStackStyling,
    paginationStyling,
    profileLayoutStyling,
    reviewCommentStyling,
    reviewContainerStyling,
    reviewContentStyling,
    reviewImageStyling,
    reviewTextAreaStyling,
    reviewTitleContainerStyling,
    reviewTitleStyling,
    searchBarInputStyling,
    searchDropdownImageStyling,
    searchDropdownItemStyling,
    searchDropdownStyling,
    sidebarLayoutStyling,
    slideShowSkeletonStyling
} from './sx';
const ProductItem = React.lazy(() => import('../components/Product/Items/ProductItem'));
const FilterSidebar = React.lazy(() => import('../components/Product/Utils/FilterSidebar'));
const Footer = React.lazy(() => import('../components/Utils/Footer'));
const ProfileSidebar = React.lazy(() => import('../pages/Profile/ProfileSidebar'));

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

export const BrownButton = styled(Button)({
    backgroundColor: '#686159',
    color: 'white',
    '&:hover': {
        backgroundColor: '#5B504B',
    },
    '&.Mui-disabled': {
        backgroundColor: '#E0E0E0',
        color: '#A6A6A6'
    },
});

export const BoldTableCell = styled(TableCell)({
    fontWeight: 'bold',
    backgroundColor: '#F8F8F8'
});

export const OutlinedBrownButton = styled(Button)({
    color: '#493C30',
    borderColor: '#83776B',
    borderWidth: '1px',
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    '&:hover': {
        borderColor: '#5B504B',
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
});

export const ActionButton = styled(Button)({
    position: 'relative',
    right: '10px',
    width: '30px',
    height: '30px',
    '&:hover': {
        backgroundColor: '#F8F8F8',
    },
});

export const BrownCreateOutlinedIcon = styled(CreateOutlined)({
    color: '#493C30',
});

export const BrownDeleteOutlinedIcon = styled(DeleteOutlined)({
    color: '#493C30',
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

export const OutlinedBrownFormControl = styled(FormControl)({
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: '#7C7164',
        },
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#7C7164',
    },
});

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
    borderRight: selected ? '4px solid #7C7164' : '',
    borderRadius: '6px',
    '&:hover': {
        backgroundColor: selected ? '#7C7164' : '#F8F8F8',
    },
}));

export const AddToCartButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#F7F7F7',
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

export const WishlistButton = styled(Button)({
    color: '#493c30',
    backgroundColor: '#F7F7F7',
    transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
    '&:hover': {
        borderColor: '#5B504B',
        backgroundColor: '#E0E0E0',
        color: '#686159',
        transition: 'color 0.3s ease-in-out',
    },
    flexShrink: 0,
});

export const BrownShoppingCartIcon = styled(ShoppingCart)({
    color: '#57534E',
    transition: 'color 0.3s ease',
});

export const DeleteButton = styled(Delete)({
    color: '#57534E',
    transition: 'color 0.3s ease',
});

export const DetailsAddToCartButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#686159',
    color: 'white',
    transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
    '& .MuiSvgIcon-root': {
        color: 'white',
        transition: 'color 0.3s ease-in-out',
    },
    '&:hover': {
        backgroundColor: '#5B504B',
        color: 'white',
        '& .MuiSvgIcon-root': {
            color: 'white',
        },
    },
    flexGrow: 1,
    marginRight: theme.spacing(2),
}));

export const DetailsWishlistButton = styled(Button)({
    color: '#493c30',
    backgroundColor: '#F7F7F7',
    width: '150px',
    transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
    '&:hover': {
        borderColor: '#5B504B',
        backgroundColor: '#E0E0E0',
        color: '#686159',
        transition: 'color 0.3s ease-in-out',
    },
    flexShrink: 0,
});

export const CustomTab = styled(Tab)(({ theme }) => ({
    flex: 1,
    textTransform: 'none',
    borderBottom: '1px solid #dddddd',
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover': {
        backgroundColor: '#F2F2F2',
        color: '#59514A',
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

export const ReviewContent = styled(Box)({
    flex: 1,
});

export const StyledGridOverlay = styled('div')({
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
});

export const StyledBox = styled(Box)({
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

export const CloseButtonStyled = styled(IconButton)({
    position: 'absolute',
    top: 16,
    right: 16,
    color: '#fff',
    zIndex: 1400,
});

export const StyledImage = styled('img')({
    maxHeight: '80%',
    maxWidth: '80%',
    objectFit: 'contain',
    borderRadius: '10px',
});

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
    borderRadius: '6px',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));

export const CheckoutButton = styled(Button)({
    backgroundColor: '#686159',
    color: 'white',
    fontSize: '1.02rem',
    padding: '4px 20px',
    '&:hover': {
        backgroundColor: '#5B504B',
    },
});

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

export const StyledHomeIcon = styled(HomeOutlined)({
    color: '#666666',
})

export const StyledInboxIcon = styled(InboxOutlined)({
    color: '#666666',
});

export const StyledMoveToInboxIcon = styled(MoveToInboxOutlined)({
    color: '#666666',
});

export const StyledShoppingCartIcon = styled(ShoppingCartOutlined)({
    color: '#666666',
});

const activeColor = '#7C7164';

export const CustomProfileIcon = ({ isActive }) => <Person style={{ color: isActive ? activeColor : 'inherit' }} />;
export const CustomAddressIcon = ({ isActive }) => <Home style={{ color: isActive ? activeColor : 'inherit' }} />;
export const CustomOrdersIcon = ({ isActive }) => <Inbox style={{ color: isActive ? activeColor : 'inherit' }} />;
export const CustomReturnIcon = ({ isActive }) => <MoveToInbox style={{ color: isActive ? activeColor : 'inherit' }} />;
export const CustomWishlistIcon = ({ isActive }) => <Favorite style={{ color: isActive ? activeColor : 'inherit' }} />;
export const CustomReviewsIcon = ({ isActive }) => <Star style={{ color: isActive ? activeColor : 'inherit' }} />;

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

export const WaveSkeleton = (props) => <Skeleton animation="wave" {...props} />;

// Loading skeletons start
export const LoadingProductDetails = () => {
    return (
        <>
            <div className='container mx-auto px-4 max-w-5xl relative top-6 right-4'>
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4, fontSize: '14px' }}>
                    <Link component={RouterLink} to="/" color="inherit" underline="none">
                        <HomeBreadCrumb className="text-stone-500 hover:text-stone-700" />
                    </Link>
                    <WaveSkeleton width={200} />
                </Breadcrumbs>
            </div>
            <div className="container mx-auto px-4 py-4 mb-8 bg-white mt-8 rounded-md max-w-5xl">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col items-center md:w-1/2">
                        <WaveSkeleton variant="rectangular" width="100%" height={320} />
                    </div>
                    <div className="md:w-1/2">
                        <WaveSkeleton variant="text" width="80%" height={40} />
                        <WaveSkeleton variant="text" width="40%" height={30} />
                        <WaveSkeleton variant="text" width="60%" height={30} />
                        <WaveSkeleton variant="text" width="50%" height={30} />
                        <div className='mt-4' />
                        <WaveSkeleton variant="text" width="50%" height={30} />
                        <div className='mt-24' />
                        <div className="mt-4 flex items-center space-x-4">
                            <WaveSkeleton variant="rectangular" width={314} height={40} className='rounded-md' />
                            <WaveSkeleton variant="rectangular" width={150} height={40} className='rounded-md' />
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
                        <WaveSkeleton variant="rectangular" width="100%" height={40} style={{ margin: '0 4px', flexGrow: 1, borderRadius: '6px' }} />
                        <WaveSkeleton variant="rectangular" width="100%" height={40} style={{ margin: '0 4px', flexGrow: 1, borderRadius: '6px' }} />
                        <WaveSkeleton variant="rectangular" width="100%" height={40} style={{ margin: '0 4px', flexGrow: 1, borderRadius: '6px' }} />
                    </Tabs>

                    <Box p={1}>
                        <WaveSkeleton variant="text" width="80%" height={30} />
                        <WaveSkeleton variant="text" width="60%" height={30} className='mt-4' />
                        <WaveSkeleton variant="text" width="40%" height={30} className='mt-4' />
                    </Box>
                </div>
            </div>
            <Footer />
        </>
    );
};

export const LoadingSlideshow = () => (
    <Box className="relative w-full mx-auto mb-14 flex justify-center items-center">
        <WaveSkeleton variant="rectangular" width="100%" height="800px" sx={{ maxWidth: '1920px', maxHeight: '500px', borderRadius: '8px' }} />

        <WaveSkeleton variant="circular" width={50} height={50} sx={{ ...slideShowSkeletonStyling, left: '20px' }} />

        <WaveSkeleton variant="circular" width={50} height={50} sx={{ ...slideShowSkeletonStyling, right: '20px', left: 'auto' }} />
    </Box>
);

export const LoadingFaq = () => (
    <>
        {Array(3).fill().map((_, index) => (
            <div key={index} className="mb-4">
                <WaveSkeleton variant="rectangular" height={60} className="rounded-md mb-2" />
                <WaveSkeleton variant="rectangular" height={50} className="rounded-md mb-2" />
            </div>
        ))}
    </>
);

export const LoadingProfile = () => (
    <>
        <WaveSkeleton variant="text" width={250} height={40} />
        <WaveSkeleton variant="text" width={265} height={30} />
    </>
);

export const LoadingReturn = () => (
    <Box sx={{ p: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }} >
        <WaveSkeleton variant="rectangular" width={400} height={56} className='rounded' />

        <WaveSkeleton variant="rectangular" width={400} height={56} className='rounded' />

        <Box sx={{ display: 'flex', alignItems: 'center' }} >
            <WaveSkeleton variant="rectangular" width={24} height={24} className='rounded' />
            <WaveSkeleton variant="text" width="60%" height={24} sx={{ ml: 1 }} className='rounded' />
        </Box>

        <WaveSkeleton variant="rectangular" width="100%" height={40} className='rounded' />
    </Box>
);

export const LoadingCart = () => {
    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 lg:px-24 py-2 mb-16 bg-gray-50 mt-10">
                {/* Mobile-only header */}
                <div className="bg-white p-4 rounded-md shadow-sm mb-3 flex justify-between items-center px-2 md:hidden mt-[72px]">
                    <h1 className="text-2xl font-semilight ml-2">Cart</h1>
                    <WaveSkeleton variant="circular" width={32} height={32} />
                </div>

                {/* Desktop-only header */}
                <div className="hidden md:block mb-4">
                    <h1 className="text-2xl font-semilight mb-2 hidden md:block">Cart</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                        {/* Desktop Table View */}
                        <div className="hidden lg:block">
                            <TableContainer className="bg-white rounded-lg">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><WaveSkeleton variant="text" width={100} height={20} /></TableCell>
                                            <TableCell align="center"><WaveSkeleton variant="text" width={80} height={20} /></TableCell>
                                            <TableCell align="center"><WaveSkeleton variant="text" width={80} height={20} /></TableCell>
                                            <TableCell align="center"><WaveSkeleton variant="text" width={80} height={20} /></TableCell>
                                            <TableCell align="center"><WaveSkeleton variant="circular" width={32} height={32} /></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Array.from(new Array(3)).map((_, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <div className="flex items-center">
                                                        <WaveSkeleton variant="rectangular" width={80} height={80} className="mr-4 rounded" />
                                                        <WaveSkeleton variant="text" width={120} height={20} />
                                                    </div>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <WaveSkeleton variant="text" width={60} height={20} />
                                                    <WaveSkeleton variant="text" width={80} height={16} />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <div className="flex justify-center items-center">
                                                        <WaveSkeleton variant="rectangular" width={100} height={36} />
                                                    </div>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <WaveSkeleton variant="text" width={60} height={20} />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <WaveSkeleton variant="circular" width={32} height={32} />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>

                        {/* Mobile Card View */}
                        <div className="lg:hidden space-y-4">
                            {Array.from(new Array(3)).map((_, index) => (
                                <div key={index} className="bg-white rounded-lg p-4">
                                    <div className="flex gap-4">
                                        <WaveSkeleton variant="rectangular" width={96} height={96} className="rounded" />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <WaveSkeleton variant="text" width="60%" height={24} />
                                                <WaveSkeleton variant="circular" width={32} height={32} />
                                            </div>
                                            <div className="mb-3">
                                                <WaveSkeleton variant="text" width={80} height={24} />
                                                <WaveSkeleton variant="text" width={120} height={20} />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <WaveSkeleton variant="rectangular" width={120} height={36} className="rounded" />
                                                <WaveSkeleton variant="text" width={80} height={24} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cart Summary Section */}
                    <div className="lg:w-80 w-full">
                        <div className="bg-white p-4">
                            <WaveSkeleton variant="text" width={140} height={32} className="mb-4" />
                            <div className="space-y-3">
                                <div className="flex justify-between py-2 border-b">
                                    <WaveSkeleton variant="text" width={80} height={24} />
                                    <WaveSkeleton variant="text" width={60} height={24} />
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <WaveSkeleton variant="text" width={80} height={24} />
                                    <WaveSkeleton variant="text" width={60} height={24} />
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <WaveSkeleton variant="text" width={100} height={24} />
                                    <WaveSkeleton variant="text" width={60} height={24} />
                                </div>
                                <div className="flex justify-between py-2">
                                    <WaveSkeleton variant="text" width={80} height={24} />
                                    <WaveSkeleton variant="text" width={60} height={24} />
                                </div>
                            </div>
                            <div className="mt-4">
                                <WaveSkeleton variant="rectangular" height={48} className="rounded" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export const LoadingProductItem = ({ count = 15 }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="bg-white rounded-md shadow-sm p-4 flex flex-col">
                    <div className="relative mb-2">
                        <WaveSkeleton variant="rectangular" width="100%" height={200} className="rounded" />
                    </div>
                    <WaveSkeleton variant="text" width="80%" height={20} className="mt-2" />
                    <div className="flex flex-col mb-5">
                        <WaveSkeleton variant="text" width="60%" height={24} className="mt-1" />
                    </div>
                    <div className="flex justify-between items-center mt-auto">
                        <WaveSkeleton variant="rectangular" width={170} height={40} className="rounded" />
                        <WaveSkeleton variant="rectangular" width={60} height={40} className="rounded" />
                    </div>
                </div>
            ))}
        </>
    );
};

export const LoadingReviewItem = () => (
    <>
        {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="relative p-4 mb-4 bg-white rounded-md shadow-sm">
                <div className="absolute top-4 right-4">
                    <WaveSkeleton variant="circular" width={24} height={24} />
                </div>

                <div className="flex flex-grow">
                    <div className="flex-shrink-0 mr-4">
                        <WaveSkeleton variant="rectangular" width={80} height={80} className="rounded-md" />
                    </div>

                    <div className="flex-grow">
                        <div className="flex items-center mb-2">
                            <WaveSkeleton variant="text" width={200} height={28} className="mr-2" />
                            <WaveSkeleton variant="text" width={100} height={28} />
                        </div>

                        <div className="mb-1">
                            <WaveSkeleton variant="text" width={180} height={24} />
                        </div>
                        <WaveSkeleton variant="text" width={150} height={20} className="mt-1" />
                        <WaveSkeleton variant="text" width={50} height={20} className="mt-1" />
                    </div>
                </div>
            </div>
        ))}
    </>
);

export const LoadingOrderItem = () => {
    return (
        <>
            <Box className="grid grid-cols-1 gap-4 rounded-md">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Box key={index} className="bg-white shadow-md rounded-lg p-6 relative">
                        <Box className="flex justify-between items-center mb-4">
                            <WaveSkeleton variant="text" width="40%" />
                            <Box>
                                <WaveSkeleton variant="text" width={100} />
                            </Box>
                        </Box>
                        <div className="flex space-x-3 mt-4 mb-2">
                            <WaveSkeleton variant="rectangular" height={50} width={50} className='rounded' />
                            <WaveSkeleton variant="rectangular" height={50} width={50} className='rounded' />
                            <WaveSkeleton variant="rectangular" height={50} width={50} className='rounded' />
                        </div>
                    </Box>
                ))}
            </Box>
        </>
    );
};

export const LoadingOrderDetails = ({ isOrder = true }) => {
    return (
        <Box>
            {/* Progress Card WaveSkeleton */}
            <Box className="bg-white shadow-md rounded-lg p-6 mb-4">
                <div className='flex flex-col items-center'>
                    <WaveSkeleton variant="text" width="60%" height={30} />
                    <WaveSkeleton variant="text" width="40%" height={20} />
                </div>
                <div className='flex flex-col items-center'>
                    <WaveSkeleton variant="text" width="50%" height={40} />
                </div>
                <Box className="flex justify-center gap-20">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <WaveSkeleton variant="text" width="10%" height={20} />
                    ))}
                </Box>
            </Box>

            {/* Products Table WaveSkeleton */}
            <Box className="bg-white shadow-md rounded-lg p-6 mb-4">
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <WaveSkeleton variant="text" width="15%" height={30} />
                                </TableCell>
                                <TableCell>
                                    <WaveSkeleton variant="text" width="100%" height={30} />
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.from({ length: 3 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row">
                                        <Box display="flex" alignItems="center">
                                            <WaveSkeleton variant="rectangular" width={80} height={80} className='rounded-md' />
                                            <Box ml={2}>
                                                <WaveSkeleton variant="text" width={150} height={20} />
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="right">
                                        <WaveSkeleton variant="text" width="50%" height={30} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {isOrder && (
                <>
                    {/* Total Amount Card WaveSkeleton */}
                    <Box className="bg-white shadow-md rounded-lg p-6 mb-4">
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <WaveSkeleton variant="text" width="20%" height={30} />
                                        </TableCell>
                                        <TableCell>
                                            <WaveSkeleton variant="text" width="100%" height={30} />
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Array.from({ length: 3 }).map((_, index) => (
                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row" className="font-bold">
                                                <Box display="flex" alignItems="center">
                                                    <WaveSkeleton variant="text" width={75} height={30} />
                                                </Box>
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                <WaveSkeleton variant="text" width="50%" height={30} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>

                    {/* Address and Payment Method Table WaveSkeleton */}
                    <Box className="bg-white shadow-md rounded-lg p-6 mb-4">
                        <TableContainer>
                            <Table>
                                <TableBody>
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row" className="font-bold">
                                                <WaveSkeleton variant="text" width="100%" height={30} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </>
            )}
        </Box >
    );
};

export const LoadingCategoryDropdown = () => (
    <div className="static bottom-4 bg-white rounded-md p-2 w-[1200px]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex items-start">
                    <WaveSkeleton variant="rectangular" width={48} height={48} className="mr-2 rounded-md" />
                    <div>
                        <WaveSkeleton variant="text" width={100} height={24} className="mb-2 rounded" />
                        <div className="flex flex-wrap">
                            {Array.from({ length: 2 }).map((_, subIndex) => (
                                <WaveSkeleton key={subIndex} variant="text" width={80} height={20} className={`mb-1 ${subIndex === 1 ? 'ml-1' : ''} rounded`} />
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const LoadingInformation = ({ showAdditionalField }) => {
    return (
        <Box className='space-y-0'>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 2 } }}>
                <div className="flex-1">
                    <WaveSkeleton variant="text" width="100%" height={70} />
                </div>
                <div className="flex-1">
                    <WaveSkeleton variant="text" width="100%" height={70} />
                </div>
                <div className="flex-1">
                    <WaveSkeleton variant="text" width="100%" height={70} />
                </div>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 2 } }}>
                <div className="flex-1">
                    <WaveSkeleton variant="text" width="100%" height={70} className='rounded' />
                </div>
                <div className="flex-1">
                    <WaveSkeleton variant="text" width="100%" height={70} className='rounded' />
                </div>
            </Box>
            {showAdditionalField && (
                <>
                    <WaveSkeleton variant="text" width="100%" height={70} className='rounded' />
                </>
            )}
            <WaveSkeleton variant="text" width={90} height={40} className='rounded' />
        </Box>
    );
};

export const LoadingCartDropdown = () => {
    return (
        <>
            <div className="space-y-4">
                {[...Array(2)].map((_, index) => (
                    <div key={index} className="flex justify-between items-center">
                        <WaveSkeleton variant="rectangular" width={48} height={48} />
                        <div className="ml-2 flex-grow space-y-1">
                            <WaveSkeleton variant="text" width="80%" height={20} />
                            <WaveSkeleton variant="text" width="50%" height={16} />
                        </div>
                        <WaveSkeleton variant="circular" width={24} height={24} />
                    </div>
                ))}
                <WaveSkeleton variant="text" width="40%" height={24} className="mt-4" />
                <WaveSkeleton variant="rectangular" width="100%" height={40} />
            </div>
        </>
    );
};

export const LoadingOverlay = () => (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50">
        <CircularProgress size={60} style={{ color: '#FFFFFF' }} />
    </div>
);

const LoadingSplide = ({ count }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(count)].map((_, index) => (
            <WaveSkeleton key={index} variant="rectangular" width="100%" height={60} className="rounded-md" />
        ))}
    </div>
);

// Loading skeletons end

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

export const CartButton = ({ isOutOfStock }) => {
    return (
        <>
            <BrownShoppingCartIcon style={{ color: isOutOfStock ? '#A6A6A6' : '' }} />
            <span className="hidden sm:inline ml-3" style={{ color: isOutOfStock ? '#A6A6A6' : '' }}>Add To Cart</span>
        </>
    );
};

export const DetailsCartButton = ({ isOutOfStock }) => {
    return (
        <>
            <BrownShoppingCartIcon style={{ color: isOutOfStock ? '#A6A6A6' : '' }} />
            <span className="ml-3" style={{ color: isOutOfStock ? '#A6A6A6' : '' }}>Add To Cart</span>
        </>
    );
};

export const CartWishlistButtons = ({ handleAction, isCartLoading, isWishlistLoading, inventoryCount }) => {
    const isOutOfStock = inventoryCount === 0;

    return (
        <>
            <AddToCartButton
                onClick={!isOutOfStock ? handleAction('cart') : null}
                disabled={isCartLoading || isWishlistLoading || isOutOfStock}
                className={`${isOutOfStock ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
                <CartButton isOutOfStock={isOutOfStock} />
            </AddToCartButton>
            <WishlistButton
                onClick={handleAction('wishlist')}
                disabled={isCartLoading || isWishlistLoading}
                className="cursor-pointer"
            >
                <FavoriteBorderOutlined />
            </WishlistButton>
        </>
    );
};

export const CartDeleteButtons = ({ handleAddToCart, handleRemove, isActionLoading, inventoryCount }) => {
    const isOutOfStock = inventoryCount === 0;

    return (
        <>
            <AddToCartButton
                onClick={handleAddToCart}
                disabled={isActionLoading || inventoryCount === 0}
            >
                <CartButton isOutOfStock={isOutOfStock} />
            </AddToCartButton>
            <WishlistButton
                onClick={handleRemove}
                disabled={isActionLoading}
            >
                <DeleteButton />
            </WishlistButton>
        </>
    )
}

export const DetailsCartWishlistButtons = ({ handleAction, isCartLoading, isWishlistLoading, inventoryCount }) => {
    const isOutOfStock = inventoryCount === 0;

    return (
        <>
            <DetailsAddToCartButton
                onClick={handleAction('cart')}
                disabled={isCartLoading || isWishlistLoading || inventoryCount === 0}
            >
                <DetailsCartButton isOutOfStock={isOutOfStock} />
            </DetailsAddToCartButton>
            <DetailsWishlistButton
                onClick={handleAction('wishlist')}
                disabled={isCartLoading || isWishlistLoading}
            >
                <FavoriteBorderOutlined />
            </DetailsWishlistButton>
        </>
    );
};

export const OutOfStock = ({ inventoryCount }) => {
    if (inventoryCount === 0) {
        return (
            <div className="absolute inset-0 bg-white opacity-75 flex items-center justify-center rounded pointer-events-none">
                <span className="text-black bg-gray-100 rounded-md px-1 font-semibold">Out of Stock</span>
            </div>
        );
    }

    return null;
};

export const DiscountPercentage = ({ discountPercentage }) => {
    if (discountPercentage > 0) {
        return (
            <span className="absolute top-0 right-0 bg-stone-500 text-white px-2 py-1 rounded text-xs">
                -{discountPercentage}%
            </span>
        )
    }

    return null;
}

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

export function HomeBreadCrumb(props) {
    return (
        <SvgIcon {...props} style={{ fontSize: 17, marginBottom: 0.7 }}>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </SvgIcon>
    );
}

export const HomeIcon = () => {
    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate('/');
    };

    return (
        <div onClick={handleHomeClick}>
            <RoundIconButton>
                <StyledHomeIcon />
            </RoundIconButton>
        </div>
    );
};

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

export const BounceAnimation = forwardRef(({ children }, ref) => (
    <motion.div
        ref={ref}
        initial={{
            y: "100%",
            opacity: 0,
            filter: "blur(10px)"
        }}
        animate={{
            y: 0,
            opacity: 1,
            filter: "blur(0px)"
        }}
        exit={{
            y: "100%",
            opacity: 0,
            filter: "blur(10px)"
        }}
        transition={{
            type: "spring",
            damping: 15,
            stiffness: 200,
            mass: 1.2,
            bounce: 0.25
        }}
    >
        {children}
    </motion.div>
));

export const CustomModal = ({ open, onClose, children, ...props }) => (
    <AnimatePresence>
        <Modal
            open={open}
            onClose={onClose}
            className="flex items-center justify-center"
            {...props}
        >
            <BounceAnimation>
                <Box className="bg-white p-2 rounded-lg shadow-lg max-w-md w-full focus:outline-none">
                    {children}
                </Box>
            </BounceAnimation>
        </Modal>
    </AnimatePresence>
);

export const CustomBox = (props) => (
    <Box className="bg-white p-2 rounded-lg max-w-md w-full focus:outline-none" {...props} />
);

export const CustomTypography = (props) => (
    <Typography className="!text-xl !font-bold !mb-4" {...props} />
);

export const CustomDeleteModal = ({ open, onClose, onDelete, title, message }) => (
    <AnimatePresence>
        <Modal open={open} onClose={onClose} className="flex items-center justify-center outline-none">
            <BounceAnimation>
                <Box
                    className="bg-white p-4 rounded-lg shadow-lg w-full"
                >
                    <Typography variant="h6" className="text-xl font-bold mb-2">
                        {title}
                    </Typography>
                    <Typography variant="body1" className="mb-4">
                        {message}
                    </Typography>
                    <div className="flex justify-end mt-4">
                        <OutlinedBrownButton onClick={onClose} variant="outlined" className="!mr-4">
                            Cancel
                        </OutlinedBrownButton>
                        <BrownButton onClick={onDelete} variant="contained" color="error">
                            Delete
                        </BrownButton>
                    </div>
                </Box>
            </BounceAnimation>
        </Modal>
    </AnimatePresence>
);

export const DetailsBreadcrumbs = ({ product }) => {
    const isMobile = useMediaQuery('(max-width:600px)');

    if (isMobile) return null;

    return (
        <div className='container mx-auto px-4 max-w-5xl relative top-6 right-4'>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4, fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <Link component={RouterLink} to="/" color="inherit" underline="none" className='cursor-pointer'>
                    <HomeBreadCrumb className="text-stone-500 hover:text-stone-700" />
                </Link>
                {product.category && (
                    <Link component={RouterLink} to={`/category/${product.category._id}`} color="inherit" underline="none" className='hover:underline cursor-pointer'>
                        {product.category.name}
                    </Link>
                )}
                {product.subcategory && (
                    <Link component={RouterLink} to={`/subcategory/${product.subcategory._id}`} color="inherit" underline="none" className='hover:underline cursor-pointer'>
                        {product.subcategory.name}
                    </Link>
                )}
                {product.subSubcategory && (
                    <Link component={RouterLink} to={`/subSubcategory/${product.subSubcategory._id}`} color="inherit" underline="none" className='hover:underline cursor-pointer'>
                        {product.subSubcategory.name}
                    </Link>
                )}
                <Typography color="text.primary" style={{ fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</Typography>
            </Breadcrumbs>
        </div>
    );
};

const BreadcrumbLink = ({ onClick, children }) => (
    <button
        onClick={onClick}
        className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
    >
        {children}
    </button>
);

const BreadcrumbSeparator = () => (
    <span className="mx-2 text-gray-400 select-none">/</span>
);

const BreadcrumbText = ({ children }) => (
    <span className="text-sm text-gray-900">
        {children}
    </span>
);

export const Breadcrumb = ({ type, data }) => {
    const navigate = useNavigate();

    const crumbs = [
        <BreadcrumbLink key="home" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
            <HomeBreadCrumb className="text-stone-500 hover:text-[#5C504B] transition-colors duration-300" />
        </BreadcrumbLink>
    ];

    if (type === 'category') {
        crumbs.push(<BreadcrumbSeparator />, <BreadcrumbText key="category">{data.name}</BreadcrumbText>);
    } else if (type === 'subcategory' && data.category) {
        crumbs.push(
            <BreadcrumbSeparator />,
            <BreadcrumbLink key="category" onClick={(e) => { e.preventDefault(); navigate(`/category/${data.category._id}`); }}>
                {data.category.name}
            </BreadcrumbLink>,
            <BreadcrumbSeparator />,
            <BreadcrumbText key="subcategory">{data.name}</BreadcrumbText>
        );
    } else if (type === 'subSubcategory') {
        if (data.category) {
            crumbs.push(
                <BreadcrumbSeparator />,
                <BreadcrumbLink key="category" onClick={(e) => { e.preventDefault(); navigate(`/category/${data.category._id}`); }}>
                    {data.category.name}
                </BreadcrumbLink>
            );
        }
        if (data.subcategory) {
            crumbs.push(
                <BreadcrumbSeparator />,
                <BreadcrumbLink key="subcategory" onClick={(e) => { e.preventDefault(); navigate(`/subcategory/${data.subcategory._id}`); }}>
                    {data.subcategory.name}
                </BreadcrumbLink>
            );
        }
        crumbs.push(<BreadcrumbSeparator />, <BreadcrumbText key="subSubcategory">{data.name}</BreadcrumbText>);
    }

    return <nav className="flex items-center space-x-1 mt-6 md:mt-0">{crumbs}</nav>;
};

export const GoBackHome = () => {
    return (
        <BrownButton
            component={RouterLink}
            to="/"
            variant="contained"
            color="primary"
            sx={goBackButtonStyling}
        >
            <ArrowBack />
            <Typography variant="button" sx={{ color: 'white' }}>
                Go back home
            </Typography>
        </BrownButton>
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

export const DetailsBox = styled(Box)({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: '5rem',
});

export const ReviewsList = ({ reviews, openModal }) => {
    return (
        <Box className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4">
            {reviews.length > 0 ? (
                reviews.map((review, index) => (
                    <ReviewCard
                        key={index}
                        onClick={() => openModal(review)}
                        style={{ cursor: 'pointer', overflow: 'hidden' }}
                    >
                        <Box className="flex justify-between items-center w-52">
                            <p className='font-semibold text-lg mr-4'>
                                {`${review.user.firstName}`}
                            </p>
                            <RatingStars rating={review.rating} />
                        </Box>
                        <p style={reviewTitleStyling}>
                            {review.title}
                        </p>
                        <p style={reviewCommentStyling}>
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
            <Box sx={reviewContainerStyling}>
                {selectedReview && selectedReview.user && (
                    <Box sx={{ display: 'flex', flex: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                        <Box sx={reviewImageStyling}>
                            <img
                                src={getImageUrl(selectedReview.product.image)}
                                alt={selectedReview.product.name}
                                onClick={() => onImageClick(selectedReview.product._id)}
                                className="w-full h-auto object-contain rounded-md cursor-pointer"
                                style={{ maxHeight: '200px' }}
                            />
                        </Box>

                        <Box sx={reviewContentStyling}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography id="review-modal-title" variant="h6" component="h2" mb={1} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' }, textAlign: 'justify' }}>
                                        {selectedReview.user.firstName} {selectedReview.user.lastName}
                                        <Typography variant="caption" color="text.secondary" component="span" sx={{ ml: 1 }}>
                                            {new Date(selectedReview.updatedAt || selectedReview.createdAt).toLocaleDateString()}
                                        </Typography>
                                        <RatingStars rating={selectedReview.rating} />
                                    </Typography>

                                    <Typography variant="h6" component="h2" display="flex" alignItems="center" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' }, textAlign: 'justify' }}>
                                        <span style={{ maxWidth: '360px', textAlign: 'left' }}>
                                            {selectedReview.product.name}
                                        </span>
                                    </Typography>

                                    <Box sx={reviewTitleContainerStyling}>
                                        {selectedReview.title}
                                    </Box>

                                    <textarea
                                        value={selectedReview.comment}
                                        readOnly
                                        style={reviewTextAreaStyling}
                                        onFocus={(e) => e.target.style.border = 'none'}
                                        className="custom-textarea break-words"
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
            sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}
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
        <Stack spacing={2} sx={paginationStackStyling(sx)}>
            <Pagination
                count={count}
                page={page}
                onChange={onChange}
                shape="rounded"
                variant="outlined"
                size={size}
                sx={paginationStyling(sx)}
                renderItem={(item) => (
                    <PaginationItem
                        {...item}
                        sx={{
                            display: item.type === 'previous' && page === 1 ? 'none' : 'inline-flex',
                            ...(item.type === 'next' && page === count ? { display: 'none' } : {}),
                        }}
                    />
                )}
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
                <motion.span {...getExpandIconProps(isOpen)}>
                    <ExpandMore className="text-brown-600" />
                </motion.span>
            </motion.button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div {...getMotionDivProps(isOpen)}>
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

export const CategoryDropdown = ({ category, subcategories, subsubcategories, navigate, dropdownStyle, loading }) => (
    <div style={dropdownStyle()} className="fixed bg-white shadow-xl rounded-md p-4 z-50">
        {loading ? (
            <LoadingCategoryDropdown />
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                {subcategories[category._id]?.map((subcategory) => (
                    <div key={subcategory._id} className="flex items-left">
                        <img
                            src={getImageUrl(subcategory.image)}
                            alt=""
                            className="rounded-md object-contain mr-2 w-12 h-12"
                        />
                        <div>
                            <button
                                onClick={() => navigate(`/subcategory/${subcategory._id}`, category._id)}
                                className="block py-2 px-2 mr-1 rounded text-gray-700 hover:bg-gray-100 font-semibold"
                            >
                                {subcategory.name}
                            </button>
                            {subsubcategories[subcategory._id]?.length > 0 && (
                                <div className="flex flex-wrap lg:flex-wrap text-start lg:text-left">
                                    {subsubcategories[subcategory._id].map((subsubcategory) => (
                                        <div key={subsubcategory._id} className="text-start">
                                            <button
                                                onClick={() => navigate(`/subSubcategory/${subsubcategory._id}`, category._id)}
                                                className="block py-1 px-2 ml-1 rounded text-gray-500 hover:bg-gray-100"
                                            >
                                                {subsubcategory.name}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
);

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
            <img src={imageSrc} alt={message} className={`${imageClass} object-contain mb-4`} />
            <p className="text-sm font-semibold mb-2">
                {message} {dynamicValue && <span>{dynamicValue}</span>}
            </p>
            {subMessage && <h1 className="text-sm font-semibold mb-2">{subMessage}</h1>}
            <h2
                onClick={() => navigate('/')}
                className="text-base font-semibold cursor-pointer hover:underline"
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

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
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
            {...customMenuProps}
            disableScrollLock
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
            sx={searchBarInputStyling}
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
    searchTerm,
    setSearchTerm,
    showSearch = false,
    showFilter = false,
    statusFilter,
    setStatusFilter,
    orderId,
    returnId,
    placeholder,
    filterType = 'orders',
    isOrderDetails = false,
    openReturnModal,
}) => {
    const isSharedWishlist = fullName.trim() !== '';
    const { open, menuRef, menuProps, menuHandlers } = useScrollAwayMenu();

    const getStatusOptions = () => {
        if (filterType === 'orders') {
            return [
                { value: 'All', label: 'All' },
                { value: 'pending', label: 'Pending' },
                { value: 'shipped', label: 'Shipped' },
                { value: 'delivered', label: 'Delivered' },
                { value: 'canceled', label: 'Canceled' }
            ];
        } else if (filterType === 'returns') {
            return [
                { value: 'All', label: 'All' },
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'processed', label: 'Processed' },
                { value: 'rejected', label: 'Rejected' }
            ];
        }
        return [];
    };

    return (
        <div className="bg-white p-4 rounded-md shadow-sm mb-3 flex justify-between items-center">
            <Typography variant="h5" className="text-gray-800 font-semilight">
                {loading ? (
                    <WaveSkeleton width={150} />
                ) : fullName.trim() ? (
                    `${fullName}'s Wishlist`
                ) : (
                    `${title} ${orderId ? `#${orderId}` : ''} ${returnId ? `#${returnId}` : ''}`
                )}
            </Typography>
            <div className="flex items-center space-x-4">
                {showSearch && (
                    <TextField
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={placeholder}
                        variant="outlined"
                        size="small"
                        sx={headerSearchStyling}
                        InputProps={{
                            endAdornment: <Search className="text-gray-400 ml-1" />
                        }}
                    />
                )}
                {showFilter && (
                    <div ref={menuRef}>
                        <Select
                            open={open}
                            {...menuHandlers}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            variant="outlined"
                            size="small"
                            sx={headerFilterStyling}
                            MenuProps={menuProps}
                        >
                            {getStatusOptions().map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                )}
                {isOrderDetails && (
                    <Button variant="outlined" onClick={openReturnModal}>
                        Request Return
                    </Button>
                )}
                {wishlistItems !== undefined && !isSharedWishlist && wishlistItems.length > 0 && (
                    <>
                        <ShareWishlist handleShareWishlist={handleShareWishlist} loading={loading} />
                        <ClearWishlist setIsModalOpen={setIsModalOpen} loading={loading} />
                    </>
                )}
            </div>
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

export const SearchDropdown = ({ results, onClickSuggestion }) => {
    const maxTitleLength = 45;

    const formatPrice = (price) => {
        return Number(price).toFixed(2);
    };

    return (
        <List sx={searchDropdownStyling}>
            {results.map((result) => (
                <ListItem
                    key={result._id}
                    button
                    onClick={() => onClickSuggestion(result._id)}
                    sx={searchDropdownItemStyling}
                >
                    <img
                        src={getImageUrl(result.image)}
                        alt={result.name}
                        style={searchDropdownImageStyling}
                    />
                    <ListItemText
                        primary={truncateText(result.name, maxTitleLength)}
                        secondary={
                            <>
                                {result.salePrice ? (
                                    <>
                                        <span className='font-bold'>€ {formatPrice(result.salePrice)}</span>
                                        <br />
                                        <span style={{ textDecoration: 'line-through', marginRight: '8px' }}>
                                            € {formatPrice(result.price)}
                                        </span>
                                    </>
                                ) : (
                                    <span className='font-bold'>€ {formatPrice(result.price)}</span>
                                )}
                            </>
                        }
                    />
                </ListItem>
            ))}
        </List>
    );
};

export const formatPrice = (price) => {
    if (price == null) return '0.00';
    return price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

const DropdownAnimation = ({ isOpen, children }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: 10 }}
                transition={{ stiffness: 100, damping: 15 }}
            >
                {children}
            </motion.div>
        )}
    </AnimatePresence>
);

export const ProfileDropdown = ({ isOpen, isAdmin, handleLogout }) => {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <div
            className="absolute right-0 mt-1 w-48 bg-white border shadow-lg rounded-lg p-2"
            tabIndex="0"
        >
            <DropdownAnimation isOpen={isOpen}>
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
            </DropdownAnimation>
        </div>
    );
};

export const CartDropdown = ({
    isOpen,
    cartItems,
    cartTotal,
    handleRemoveItem,
    handleGoToCart,
    isLoading,
    handleProductClick
}) => {
    return (
        <div tabIndex="0" className="absolute right-0 mt-1 w-96 bg-white border shadow-lg rounded-lg p-4">
            <DropdownAnimation isOpen={isOpen}>
                {isLoading ? (
                    <LoadingCartDropdown />
                ) : cartItems.length === 0 ? (
                    <div className="text-sm text-left">You have no products in your cart</div>
                ) : (
                    <>
                        <ul className="mt-2 mb-2 overflow-y-auto max-h-60">
                            {cartItems.map(item => (
                                <li
                                    key={`${item.product._id}-${item.quantity}`}
                                    className="flex justify-between items-center mb-4"
                                >
                                    <img
                                        src={getImageUrl(item.product.image)}
                                        alt={item.product.name}
                                        onClick={() => handleProductClick(item.product._id)}
                                        className="w-12 h-12 object-contain rounded cursor-pointer"
                                    />
                                    <div className="ml-2 flex-grow">
                                        <span
                                            onClick={() => handleProductClick(item.product._id)}
                                            className="block font-semibold cursor-pointer hover:underline truncate max-w-[calc(22ch)]"
                                        >
                                            {item.product.name}
                                        </span>
                                        <span className="block text-sm text-gray-500">
                                            {item.quantity} x {item.product.salePrice > 0 ? formatPrice(item.product.salePrice) : formatPrice(item.product.price)} €
                                        </span>
                                    </div>
                                    <RoundIconButton
                                        onClick={() => handleRemoveItem(item.product._id)}
                                        disabled={isLoading}
                                    >
                                        <BrownDeleteOutlinedIcon />
                                    </RoundIconButton>
                                </li>
                            ))}
                        </ul>
                        <hr className="border-stone-200" />
                        <div className="flex justify-between items-center mt-4 mb-4">
                            <div className="flex justify-start items-center space-x-1">
                                <span className="font-semibold">Total:</span>
                                <span className="font-semibold">{formatPrice(cartTotal)} €</span>
                            </div>
                        </div>
                        <BrownButton onClick={handleGoToCart} disabled={isLoading} fullWidth>
                            Go to Cart
                        </BrownButton>
                    </>
                )}
            </DropdownAnimation>
        </div>
    );
};

export const LoginButton = () => {
    const navigate = useNavigate();

    return (
        <>
            <RoundIconButton
                onClick={() => navigate('/login')}
                sx={{ color: '#686159' }}
            >
                <Login />
            </RoundIconButton>
        </>
    )
}

export const NavbarLogo = ({ dashboardStyling }) => {
    const navigate = useNavigate();

    return (
        <a href="/" onClick={(e) => {
            e.preventDefault();
            navigate('/');
        }}>
            <Tooltip title="Home" arrow>
                <div className={`flex items-center cursor-pointer ${dashboardStyling || ''}`}>
                    <img src={logo} alt="Logo" className="w-32 md:w-auto h-9" />
                </div>
            </Tooltip>
        </a>
    );
}

export const ProfileIcon = ({ handleProfileDropdownToggle, isDropdownOpen }) => {
    const [firstName, setFirstName] = useState('');
    const [loading, setLoading] = useState(true);
    const axiosInstance = useAxios();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get('/auth/me');
                const userData = response.data;
                setFirstName(userData.firstName);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                toast.error('Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return (
        <Tooltip title="Profile" arrow>
            <div className="flex items-center">
                <ProfileButton
                    onMouseDown={handleProfileDropdownToggle}
                    className="flex items-center space-x-2 rounded-sm"
                >
                    {isDropdownOpen ? <StyledPersonIcon component={Person} /> : <StyledPersonIcon component={PersonOutlined} />}
                    {loading ? (
                        <WaveSkeleton variant="text" width={80} height={20} className="ml-1" />
                    ) : (
                        firstName && (
                            <span className="ml-2 text-sm overflow-hidden text-ellipsis">{firstName}</span>
                        )
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

export const CartIcon = ({ totalQuantity, handleCartDropdownToggle, isDropdownOpen }) => {
    return (
        <RoundIconButton aria-label="cart" onMouseDown={handleCartDropdownToggle}>
            <Badge
                badgeContent={totalQuantity}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                sx={{
                    '& .MuiBadge-badge': {
                        backgroundColor: '#7C7164',
                        color: 'white',
                    },
                }}
                showZero
            >
                {isDropdownOpen ? <StyledShoppingCartIcon component={ShoppingCart} /> : <StyledShoppingCartIcon component={ShoppingCartOutlined} />}
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
                sx={{ ...(open && { display: 'none' }) }}
                className='mr-36'
            >
                <MenuIcon />
            </IconButton>
        </Tooltip>
    )
}

export const DashboardCollapse = ({ toggleDrawer }) => {
    return (
        <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: [1] }}>
            <CollapseIcon toggleDrawer={toggleDrawer} />
        </Toolbar>
    )
}

export const ImageSlide = ({ image, onLoad }) => (
    <SplideSlide>
        <div className="flex justify-center items-center">
            <img
                src={getImageUrl(image.image)}
                alt={image.title}
                onLoad={onLoad}
                style={{ width: '1920px', height: '500px' }}
                className="object-cover rounded-md"
            />
        </div>
    </SplideSlide>
);

export const splideOptions = {
    type: 'slide',
    perPage: 1,
    autoplay: true,
    interval: 3000,
    pagination: true,
    arrows: true,
    width: '100%',
    height: 'auto',
    gap: '11px',
    breakpoints: {
        1024: { perPage: 1 },
        600: { perPage: 1 },
        480: { perPage: 1 },
    },
};

export const useScrollAwayMenu = () => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleScroll = (e) => {
            if (!open) return;

            const menuElement = menuRef.current;
            if (!menuElement) return;

            const menuRect = menuElement.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            if (menuRect.bottom < 0 || menuRect.top > viewportHeight) {
                setOpen(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [open]);

    const menuProps = {
        disableScrollLock: true,
        disableRestoreFocus: true,
        anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
        },
        transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
        }
    };

    return {
        open,
        setOpen,
        menuRef,
        menuProps,
        menuHandlers: {
            onOpen: () => setOpen(true),
            onClose: () => setOpen(false)
        }
    };
};

const SplideSlides = ({ items, onCardClick, showImage, splideRef }) => (
    <Splide
        ref={splideRef}
        options={{
            type: 'slide',
            perPage: 3,
            breakpoints: {
                768: { perPage: 2 },
                480: { perPage: 1 },
            },
            gap: '1rem',
            pagination: false,
            drag: true,
            arrows: false,
        }}
    >
        {items.map(item => (
            <SplideSlide key={item._id}>
                <div
                    onClick={() => onCardClick(item._id)}
                    className="flex items-center p-4 bg-white rounded-md cursor-pointer hover:underline hover:shadow-lg transition-shadow duration-300"
                >
                    {showImage && (
                        <img
                            src={getImageUrl(item.image)}
                            alt={item.name}
                            className="object-contain mr-3 w-7 h-7"
                        />
                    )}
                    <span className="font-medium text-base">{truncateText(item.name, 24)}</span>
                </div>
            </SplideSlide>
        ))}
    </Splide>
);

const SplideArrows = ({ loading, items, id, handlePrev, isBeginning, handleNext, isEnd }) => {
    if (loading || (isBeginning && isEnd) || !items[id]?.length || items[id].length == 1) return null;

    return (
        <div className="flex justify-end mt-2 space-x-2">
            <IconButton
                onClick={handlePrev}
                color="primary"
                aria-label="Previous slide"
                size="small"
                disabled={isBeginning}
                className={isBeginning ? 'opacity-50 cursor-not-allowed' : ''}
            >
                <ArrowBackIosNew fontSize="small" />
            </IconButton>
            <IconButton
                onClick={handleNext}
                color="primary"
                aria-label="Next slide"
                size="small"
                disabled={isEnd}
                className={isEnd ? 'opacity-50 cursor-not-allowed' : ''}
            >
                <ArrowForwardIos fontSize="small" />
            </IconButton>
        </div>
    );
};

const SplideSort = ({ sortOrder, onSortChange, showTopStyle = true }) => {
    const { open, menuRef, menuProps, menuHandlers } = useScrollAwayMenu();

    return (
        <div className={`flex justify-between items-baseline ${showTopStyle ? 'relative top-1' : ''}`}>
            <p className="text-base text-stone-600">Products</p>
            <div ref={menuRef}>
                <FormControl variant="outlined" size="small" className="w-56">
                    <InputLabel>Sort By</InputLabel>
                    <Select
                        open={open}
                        {...menuHandlers}
                        value={sortOrder}
                        onChange={onSortChange}
                        label="Sort By"
                        MenuProps={menuProps}
                    >
                        <MenuItem value="relevancy">Relevancy</MenuItem>
                        <MenuItem value="lowToHigh">Price: Low to High</MenuItem>
                        <MenuItem value="highToLow">Price: High to Low</MenuItem>
                        <MenuItem value="newest">Newest</MenuItem>
                        <MenuItem value="highestSale">Highest sale percentage</MenuItem>
                    </Select>
                </FormControl>
            </div>
        </div>
    );
};

export const SplideList = ({
    items = {},
    id,
    loading,
    onCardClick,
    showImage = true,
    sortOrder,
    onSortChange,
    showSplide = true,
    showTopStyle = true,
}) => {
    const [skeletonCount, setSkeletonCount] = useState(1);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
    const splideRef = useRef(null);

    // Mobile WaveSkeleton and arrow visibility
    useEffect(() => {
        const updateSkeletonCount = () => setSkeletonCount(window.innerWidth >= 768 ? 3 : 1);
        const updateViewType = () => setIsMobileView(window.innerWidth < 768);

        updateSkeletonCount();
        updateViewType();

        window.addEventListener('resize', updateSkeletonCount);
        window.addEventListener('resize', updateViewType);

        return () => {
            window.removeEventListener('resize', updateSkeletonCount);
            window.removeEventListener('resize', updateViewType);
        };
    }, []);

    useEffect(() => {
        if (splideRef.current && splideRef.current.splide) {
            const splide = splideRef.current.splide;
            const updateButtons = () => {
                setIsBeginning(splide.index === 0);
                setIsEnd(splide.index === splide.length - splide.options.perPage);
            };

            updateButtons();
            splide.on('moved', updateButtons);
            splide.on('resize', updateButtons);

            return () => {
                splide.off('moved', updateButtons);
                splide.off('resize', updateButtons);
            };
        }
    }, [items, id]);

    const handlePrev = () => splideRef.current.splide.go('<');
    const handleNext = () => splideRef.current.splide.go('>');

    const currentItems = items[id] || [];
    const showArrows = isMobileView || currentItems.length >= 3;

    return (
        <>
            {showSplide && (
                <div className="max-w-[870px] mb-11">
                    {loading ? (
                        <LoadingSplide count={skeletonCount} />
                    ) : (
                        <SplideSlides
                            items={currentItems}
                            onCardClick={onCardClick}
                            showImage={showImage}
                            splideRef={splideRef}
                        />
                    )}
                    {showArrows && (
                        <SplideArrows
                            loading={loading}
                            items={items}
                            id={id}
                            handlePrev={handlePrev}
                            isBeginning={isBeginning}
                            handleNext={handleNext}
                            isEnd={isEnd}
                        />
                    )}
                </div>
            )}
            <SplideSort sortOrder={sortOrder} onSortChange={onSortChange} showTopStyle={showTopStyle} />
        </>
    );
};

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
    return (
        <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
                {auth.accessToken ? (
                    <div className="relative ml-4">
                        <ProfileIcon
                            handleProfileDropdownToggle={handleProfileDropdownToggle}
                            isDropdownOpen={isDropdownOpen}
                            auth={auth}
                        />
                        {isDropdownOpen && (
                            <ProfileDropdown
                                isOpen={isDropdownOpen}
                                isAdmin={isAdmin}
                                handleLogout={handleLogout}
                            />
                        )}
                    </div>
                ) : (
                    <LoginButton />
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
            sx={{ boxShadow: '1px 0px 3px rgba(0, 0, 0, 0.1)', display: 'flex' }}
        >
            {children}
        </AppBar>
    );
};

export const DashboardToolbar = ({ children }) => {
    return (
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

export const SidebarLayout = ({ children }) => {
    return (
        <Box sx={sidebarLayoutStyling}>
            {children}
        </Box>
    )
}

export const ProfileLayout = ({ children }) => {
    return (
        <Box sx={profileLayoutStyling}>
            <ProfileSidebar />
            <Box
                component="main"
                sx={layoutContainerStyle}
            >
                {children}
            </Box>
        </Box>
    );
};

export const FilterLayout = ({
    children,
    loading,
    products,
    noProducts,
    breadcrumbType,
    breadcrumbData,
    onApplyPriceFilter,
    onSaleToggle = false,
}) => (
    <Box sx={filterLayoutStyling}>
        <div className="absolute top-0 z-10 pb-4 bg-gray-50">
            {loading ? (
                <WaveSkeleton variant="text" width={250} height={20} />
            ) : products.length > 0 ? (
                <div>
                    <Breadcrumb type={breadcrumbType} data={breadcrumbData} />
                </div>
            ) : (
                <EmptyState
                    imageSrc={noProducts}
                    message="No products found for"
                    dynamicValue={breadcrumbData?.name}
                    containerClass="p-8 mt-4 mx-14 md:mx-16 lg:mx-72"
                    imageClass="w-32 h-32"
                />
            )}
        </div>
        <FilterSidebar onApplyPriceFilter={onApplyPriceFilter} onSaleToggle={onSaleToggle} />
        <Box
            component="main"
            sx={layoutContainerStyle}
        >
            {children}
        </Box>
    </Box>
);

export const ProductGrid = ({ loading, currentPageItems, isMainPage = false }) => (
    <div className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 ${isMainPage ? 'lg:grid-cols-5' : 'lg:grid-cols-3'} gap-4 mt-6`}>
        {loading ? (
            <LoadingProductItem />
        ) : (
            currentPageItems.map(product => <ProductItem key={product._id} product={product} />)
        )}
    </div>
);

export const handlePageChange = (setPage) => (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
};

export const calculatePageCount = (items, itemsPerPage) => Math.ceil(items.length / itemsPerPage);

export const getPaginatedItems = (items, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
};

export const filterProductsByPrice = (products, range) => {
    return products.filter(product => {
        const priceToCheck = product.salePrice || product.price;
        if (range.min && priceToCheck < parseFloat(range.min)) return false;
        if (range.max && priceToCheck > parseFloat(range.max)) return false;
        return true;
    });
};

export const sortProducts = (products, order) => {
    let sortedProducts = [...products];
    switch (order) {
        case 'lowToHigh':
            return sortedProducts.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        case 'highToLow':
            return sortedProducts.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        case 'newest':
            return sortedProducts.sort((a, b) => new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt));
        case 'highestSale':
            return sortedProducts.sort((a, b) => (b.discount?.value || 0) - (a.discount?.value || 0));
        default:
            return products;
    }
};

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