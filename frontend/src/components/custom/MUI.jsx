import {
    ArrowBack,
    ChevronLeft,
    Close,
    DeleteOutline,
    ExpandLess,
    ExpandMore,
    FavoriteBorderOutlined,
    Fullscreen,
    FullscreenExit,
    Login,
    Replay,
    Search,
    Share,
    ZoomIn,
    ZoomOut
} from "@mui/icons-material";
import {
    Box,
    Button,
    ClickAwayListener,
    Collapse,
    Divider,
    FormControl,
    IconButton,
    InputAdornment,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Modal,
    AppBar as MuiAppBar, Drawer as MuiDrawer,
    Pagination,
    PaginationItem,
    Paper,
    Stack,
    styled,
    Tab,
    TextField,
    Toolbar,
    Tooltip,
    Typography,
    useTheme
} from "@mui/material";
import { GridToolbar } from "@mui/x-data-grid";
import { useField } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import PropTypes from 'prop-types';
import { forwardRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/img/brand/logo.png';
import { boxSx, customBoxSx, customModalSx, deleteModalTypographySx, goBackButtonSx, iconButtonSx, paginationStackSx, paginationStyling, searchBarInputSx, sidebarLayoutSx } from "../../assets/sx";
import { AccountLinkStatusIcon, BrownShoppingCartIcon, CartIcon, CollapseIcon, DeleteButtonIcon, NotificationIcon, ProfileIcon } from "./Icons";
import { LoadingLabel } from "./LoadingSkeletons";
import { CartDropdown, NotificationDropdown } from "./Product";
import { ProfileDropdown } from "./Profile";
import { getEmptyStateMessage } from "./utils";

/**
 * @file MUI.jsx
 * @description A collection of custom reusable Material-UI (MUI) components for the application.
 *
 * This file provides a set of custom-built MUI components that can be used throughout the application.
 * The components are customized to match the application's design and can be easily imported and used in various parts of the application.
 */

export const BrownOutlinedTextField = styled((props) => {
    return (
        <TextField
            {...props}
            FormHelperTextProps={{
                sx: {
                    marginLeft: 0,
                    ...(props?.FormHelperTextProps?.sx || {}),
                },
                ...props.FormHelperTextProps,
            }}
        />
    );
})(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.mode === 'dark' ? '#FFFFFF' : '#7C7164',
        },
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#7C7164',
    },
}));

export const BrownButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#686159',
    color: 'white',
    '&:hover': {
        backgroundColor: '#5B504B',
    },
    '&.Mui-disabled': {
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : '#E0E0E0',
        color: '#A6A6A6',
    },
}));

export const OutlinedBrownButton = styled(Button)(({ theme }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.text.primary : '#493C30',
    borderColor: theme.palette.mode === 'dark' ? theme.palette.divider : '#83776B',
    borderWidth: '1px',
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    '&:hover': {
        borderColor: theme.palette.mode === 'dark' ? theme.palette.primary.main : '#5B504B',
        backgroundColor: theme.palette.action.hover,
    },
}));

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
            borderColor: theme.palette.mode === 'dark' ? '#FFFFFF' : '#7C7164',
        },
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#7C7164',
    },
}));

export const drawerWidth = 250;

export const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'open', })(({ theme, open }) => ({
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

export const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
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
}));

export const ActiveListItemButton = styled(ListItemButton, { shouldForwardProp: (prop) => prop !== 'isMainPage' && prop !== 'isDashboard', })(({ theme, selected, isMainPage = false, isDashboard = false }) => ({
    backgroundColor: isDashboard ? selected ? theme.palette.primary.main : theme.palette.background.paper : selected ? '#7C7164' : 'white',
    color: isDashboard ? selected ? theme.palette.primary.main : theme.palette.text.primary : selected ? 'black' : 'inherit',
    borderRight: isDashboard
        ? selected ? `4px solid ${theme.palette.primary.main}` : ''
        : selected ? '4px solid #7C7164' : '',
    borderRadius: '6px',
    paddingLeft: isMainPage ? '16px !important' : '28px',
    '&:hover': {
        backgroundColor: isDashboard
            ? selected ? theme.palette.mode === 'dark'
                ? theme.palette.primary.dark
                : theme.palette.primary.light
                : theme.palette.action.hover
            : selected
                ? '#7C7164'
                : '#F8F8F8',
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
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    transition: 'transform 0.2s ease-in-out',
    cursor: 'pointer',
    width: '220px',
    '&:hover': {
        transform: 'scale(1.01)',
    },
}));

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

export const ProfileButton = styled(IconButton, { shouldForwardProp: (prop) => prop !== 'isDropdownOpen', })(({ theme, isDropdownOpen }) => ({
    color: 'black',
    width: '100px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: '6px',
    backgroundColor: isDropdownOpen ? theme.palette.action.hover : 'transparent',
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

export const ProductDetailsBox = styled(Box)({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: '5rem',
});

export const CustomPaper = (props) => (
    <Paper {...props} sx={{ maxHeight: 200, overflow: 'auto' }} />
);

export const CustomModal = ({ open, onClose, children, ...props }) => {
    const theme = useTheme();

    return (
        <AnimatePresence>
            <Modal
                open={open}
                onClose={onClose}
                disableAutoFocus={false}
                disableEnforceFocus={false}
                disableRestoreFocus={false}
                sx={customModalSx}
                className="flex items-center justify-center p-4 sm:p-0 outline-none"
                {...props}
            >
                <>
                    <BounceAnimation>
                        <Box
                            tabIndex="-1"
                            sx={boxSx(theme)}
                            className="rounded-lg shadow-lg w-full mx-auto max-w-[95vw] sm:max-w-md outline-none"
                        >
                            {children}
                        </Box>
                    </BounceAnimation>
                </>
            </Modal>
        </AnimatePresence>
    );
};

export const CustomToolbar = () => {
    return (
        <>
            <div className="flex justify-end px-4">
                <GridToolbar />
            </div>
            <Divider />
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
};

export const CloseButton = ({ onClose }) => (
    <IconButton
        aria-label="close"
        onClick={onClose}
        sx={iconButtonSx}
    >
        <Close />
    </IconButton>
);

export const DrawerTypography = ({ theme, children }) => (
    <Typography variant="body2" style={{ color: theme.palette.text.primary }}>
        {children}
    </Typography>
);

export const CustomTypography = (props) => {
    const theme = useTheme();

    return (
        <Typography
            sx={{
                color: theme.palette.text.primary,
            }}
            className="!text-xl !font-bold !mb-3"
            {...props}
        />
    );
};

export const CustomBox = ({ isScrollable, children, ...props }) => {
    const theme = useTheme();

    return (
        <Box
            sx={customBoxSx(theme, isScrollable)}
            className="p-3 sm:p-4 rounded-lg w-full !outline-none !focus:outline-none"
            {...props}
        >
            {children}
        </Box>
    );
};

export const DetailsBox = ({ children, hasPadding = true, }) => (
    <Box
        sx={{ p: { xs: 3, md: 3 } }}
        className={`bg-white rounded-md shadow-sm mb-5${hasPadding ? ' !p-5' : ''}`}
    >
        {children}
    </Box>
);

export const BoxBetween = (props) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }} {...props} />
);

export const CustomTextField = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = (e) => {
        field.onBlur(e);
        setIsFocused(false);
    };

    const showError = (isFocused || meta.touched) && !!meta.error;

    return (
        <BrownOutlinedTextField
            onFocus={handleFocus}
            onBlur={handleBlur}
            label={label}
            error={showError}
            helperText={showError ? meta.error : ""}
            fullWidth
            {...field}
            {...props}
            className='!mb-4'
        />
    );
};

export const ReadOnlyTextField = styled((props) => {
    return (
        <TextField
            variant="outlined"
            fullWidth
            InputProps={{
                readOnly: true,
                ...props.InputProps,
            }}
            {...props}
        />
    );
})(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.mode === 'dark' ? '#FFFFFF' : '#7C7164',
        },
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#7C7164',
    },
}));

export const CollapsibleListItem = ({ open, handleClick, icon, primary, children }) => (
    <>
        <ListItemButton onClick={handleClick}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={primary} />
            {open ? <ExpandLess className='text-stone-500' /> : <ExpandMore className='text-stone-500' />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
                {children}
            </List>
        </Collapse>
    </>
);

export const ActiveListItem = ({ icon, primary, handleClick, selected, sx, isMainPage = false, isDashboard = false }) => (
    <ActiveListItemButton
        onClick={handleClick}
        selected={selected}
        isMainPage={isMainPage}
        isDashboard={isDashboard}
        sx={sx}
    >
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
                <DeleteButtonIcon />
            </WishlistButton>
        </>
    );
};

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

export const ShareWishlist = ({ handleShareWishlist, loading }) => {
    return (
        <Button
            startIcon={<Share />}
            onClick={handleShareWishlist}
            disabled={loading}
        >
            Share Wishlist
        </Button>
    );
};


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
    );
};

export const AccountLinkStatus = ({ hasId, platform }) => {
    return (
        <ReadOnlyTextField
            label={`${platform} Account`}
            value={hasId ? `Linked` : `Not linked`}
            InputProps={{
                startAdornment: <AccountLinkStatusIcon hasId={hasId} />
            }}
        />
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
    );
};

export const KeyboardKey = ({ theme, children, customStyle = "" }) => {
    return (
        <Box
            component="span"
            sx={{ borderColor: theme.palette.border.default }}
            className={`inline-block px-2 py-[2px] mx-[2.6px] border rounded-md font-mono text-xs bg-transparent ${customStyle}`}
        >
            {children}
        </Box>
    );
};

export const GoBackHome = () => {
    const navigate = useNavigate();

    return (
        <BrownButton
            onClick={() => navigate('/')}
            variant="contained"
            color="primary"
            sx={goBackButtonSx}
        >
            <ArrowBack />
            <Typography variant="button" sx={{ color: 'white' }}>
                Go back home
            </Typography>
        </BrownButton>
    );
};

export const ZOOM_FACTOR = 0.65;
export const MAX_ZOOM_LEVEL = 1 + 2 * ZOOM_FACTOR;

export const ImagePreviewControls = ({ scale, setScale, isFullscreen, adjustZoom, toggleFullscreen, resetAndClose }) => {
    const theme = useTheme();

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: theme.palette.background.paper, }}
            className="absolute top-2 right-2 flex gap-2 p-1 rounded"
        >
            <IconButton
                onClick={() => adjustZoom('out')}
                disabled={scale <= 1}
                style={{ color: theme.palette.text.secondary, }}
            >
                <ZoomOut />
            </IconButton>
            <IconButton
                onClick={() => adjustZoom('in')}
                disabled={scale >= MAX_ZOOM_LEVEL}
                style={{ color: theme.palette.text.secondary, }}
            >
                <ZoomIn />
            </IconButton>
            <IconButton
                onClick={() => setScale(1)}
                disabled={scale === 1}
                style={{ color: scale === 1 ? theme.palette.text.disabled : theme.palette.text.secondary, }}
            >
                <Replay />
            </IconButton>
            <IconButton
                onClick={toggleFullscreen}
                style={{ color: isFullscreen ? theme.palette.primary.main : theme.palette.text.secondary, }}
            >
                {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
            <IconButton
                onClick={resetAndClose}
                style={{ color: theme.palette.text.secondary }}
            >
                <Close />
            </IconButton>
        </div>
    );
};

export const GoBackArrow = () => {
    return (
        <div className="flex justify-start">
            <ChevronLeft className="text-stone-600" />
        </div>
    );
};

export const GoBackButton = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

    return (
        <div className="flex justify-left mb-4">
            <RoundIconButton
                onClick={goBack}
                className="text-black rounded-md px-4 py-2"
            >
                <GoBackArrow />
            </RoundIconButton>
        </div>
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
            sx={searchBarInputSx}
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

export const DashboardCollapse = ({ toggleDrawer }) => {
    const theme = useTheme();

    return (
        <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: [1] }}>
            <CollapseIcon toggleDrawer={toggleDrawer} className={`text-${theme.palette.mode === 'dark' ? 'white' : 'stone-700'}`} />
        </Toolbar>
    );
};

export const CustomPagination = ({ count, page, onChange, size = 'large', sx = {} }) => {
    const paginationEnabled = count > 1;

    if (!paginationEnabled) return null;

    return (
        <Stack spacing={2} sx={paginationStackSx(sx)}>
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

export const NavbarLogo = ({ dashboardStyling }) => {
    const navigate = useNavigate();

    return (
        <a href="/" onClick={(e) => {
            e.preventDefault();
            navigate('/');
        }}>
            <div className={`flex items-center cursor-pointer ${dashboardStyling || ''}`}   >
                <img src={logo} alt="logo" className="w-[132px] md:w-auto h-9" />
            </div>
        </a>
    );
};

export const SidebarLayout = ({ children }) => {
    return (
        <Box sx={sidebarLayoutSx}>
            {children}
        </Box>
    );
};

export const BounceAnimation = forwardRef(({ children }, ref) => (
    <motion.div
        ref={ref}
        initial={{
            y: "100%",
            opacity: 0
        }}
        animate={{
            y: 0,
            opacity: 1
        }}
        exit={{
            y: "100%",
            opacity: 0
        }}
        transition={{
            type: "spring",
            damping: 20,
            stiffness: 180,
            mass: 1.5,
            bounce: 0.2
        }}
    >
        {children}
    </motion.div>
));

export const DropdownAnimation = ({ isOpen, children }) => (
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

export const CustomDeleteModal = ({ open, onClose, onDelete, loading, title, message }) => {
    const theme = useTheme();

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <Typography
                    variant="h6"
                    style={deleteModalTypographySx(theme)}
                    className="text-xl font-bold mb-2"
                >
                    {title}
                </Typography>
                <Typography
                    variant="body1"
                    style={deleteModalTypographySx(theme)}
                    className="mb-4"
                >
                    {message}
                </Typography>
                <div className="flex justify-end mt-4">
                    <OutlinedBrownButton onClick={onClose} className="!mr-3">
                        Cancel
                    </OutlinedBrownButton>
                    <BrownButton
                        onClick={onDelete}
                        disabled={loading}
                    >
                        <LoadingLabel loading={loading} defaultLabel="Delete" loadingLabel="Deleting" />
                    </BrownButton>
                </div>
            </CustomBox>
        </CustomModal>
    );
};

export const ErrorPage = ({ errorType, imageSrc }) => {
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

export const ErrorTooltip = ({ field, focusedField, isValid, message, value, isLoginPage = false }) =>
    focusedField === field && value.trim() && !isValid && (
        <div className={`absolute left-0 ${isLoginPage ? 'top-[74px]' : 'top-[58px]'} bg-white text-red-500 text-sm p-2 rounded-lg shadow-md w-full z-10`}>
            <span className="block text-xs font-semibold mb-1">{message.title}</span>
            {message.details}
            <div className="absolute top-[-5px] left-[20px] w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-transparent border-b-white"></div>
        </div>
    );

export const EmptyState = ({
    imageSrc,
    context = 'reviews',
    items = [],
    searchTerm = '',
    statusFilter = 'All',
    containerClass = 'p-8',
    imageClass = 'w-60 h-60',
}) => {
    const message = getEmptyStateMessage(context, items, searchTerm, statusFilter);

    return (
        <div className={`flex flex-col items-center justify-center bg-white rounded-sm shadow-sm ${containerClass}`}>
            <img src={imageSrc} alt={message} className={`${imageClass} object-contain mb-4`} />
            <p className="text-base font-semibold mb-2">{message}</p>
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

export const NotFound = ({
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

export const ProfileMenu = ({
    isProfileDropdownOpen,
    setIsProfileDropdownOpen,
    toggleDropdown,
    isAdmin,
    isOrderManager,
    isContentManager,
    isProductManager,
    handleLogout
}) => {
    return (
        <ClickAwayListener onClickAway={() => setIsProfileDropdownOpen(false)}>
            <div className="relative z-[1000]">
                <ProfileIcon
                    handleProfileDropdownToggle={() => toggleDropdown('profile')}
                    isDropdownOpen={isProfileDropdownOpen}
                />
                {isProfileDropdownOpen && (
                    <ProfileDropdown
                        isOpen={isProfileDropdownOpen}
                        isAdmin={isAdmin}
                        isOrderManager={isOrderManager}
                        isContentManager={isContentManager}
                        isProductManager={isProductManager}
                        handleLogout={handleLogout}
                    />
                )}
            </div>
        </ClickAwayListener>
    );
};

export const CartMenu = ({
    isCartDropdownOpen,
    setIsCartDropdownOpen,
    toggleDropdown,
    cartItems,
    cartCount,
    cartTotal,
    handleRemoveItem,
    handleClearCart,
    handleUpdateQuantity,
    handleGoToCart,
    isLoading,
    handleProductClick
}) => {
    return (
        <ClickAwayListener onClickAway={() => setIsCartDropdownOpen(false)}>
            <div className="relative z-[1000]">
                <CartIcon
                    handleCartDropdownToggle={() => toggleDropdown('cart')}
                    totalQuantity={cartCount}
                    isDropdownOpen={isCartDropdownOpen}
                />
                {isCartDropdownOpen && (
                    <CartDropdown
                        isOpen={isCartDropdownOpen}
                        cartItems={cartItems}
                        cartTotal={cartTotal}
                        handleRemoveItem={handleRemoveItem}
                        handleClearCart={handleClearCart}
                        handleUpdateQuantity={handleUpdateQuantity}
                        handleGoToCart={handleGoToCart}
                        isLoading={isLoading}
                        handleProductClick={handleProductClick}
                    />
                )}
            </div>
        </ClickAwayListener>
    );
};

export const NotificationMenu = ({
    isNotifDropdownOpen,
    setIsNotifDropdownOpen,
    toggleDropdown,
    notifications,
    isLoading,
    onToggleRead,
    onArchive,
    onToggleReadAll,
    isAllRead,
    unreadCount,
    activeFilter,
    onFilterChange,
    onUnarchive,
}) => {
    return (
        <ClickAwayListener onClickAway={() => setIsNotifDropdownOpen(false)}>
            <div className="relative z-[1000]">
                <NotificationIcon
                    unreadCount={unreadCount}
                    handleNotifDropdownToggle={() => toggleDropdown('notif')}
                    isDropdownOpen={isNotifDropdownOpen}
                />
                {isNotifDropdownOpen && (
                    <NotificationDropdown
                        isOpen={isNotifDropdownOpen}
                        notifications={notifications}
                        isLoading={isLoading}
                        onToggleRead={onToggleRead}
                        onArchive={onArchive}
                        onToggleReadAll={onToggleReadAll}
                        isAllRead={isAllRead}
                        activeFilter={activeFilter}
                        onFilterChange={onFilterChange}
                        onUnarchive={onUnarchive}
                    />
                )}
            </div>
        </ClickAwayListener>
    );
};