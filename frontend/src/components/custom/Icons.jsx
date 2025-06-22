import {
    Archive,
    Check,
    ChevronLeft,
    Clear,
    Create,
    DashboardOutlined,
    DataObject,
    Delete,
    DeleteOutlined,
    Description,
    Download,
    Favorite,
    FavoriteBorderOutlined,
    Home,
    HomeOutlined,
    Inbox,
    InboxOutlined,
    Lock,
    Logout,
    Mail,
    MarkEmailRead,
    MarkEmailUnread,
    Menu as MenuIcon,
    MoreVert,
    MoveToInbox,
    MoveToInboxOutlined,
    Notifications,
    NotificationsOutlined,
    Person,
    PersonOutlined,
    ShoppingCart,
    ShoppingCartOutlined,
    Star,
    Unarchive,
    Visibility
} from "@mui/icons-material";
import { Badge, Box, IconButton, SvgIcon, useTheme } from "@mui/material";
import { green, red } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { profileIconSx } from "../../assets/sx";
import { WaveSkeleton } from "./LoadingSkeletons";
import { ProfileButton, RoundIconButton } from "./MUI";

/**
 * @file Icons.jsx
 * @description A collection of reusable icons and icon-related components for the application.
 *
 * This file provides a set of pre-built icons and icon-related components that can be used throughout the application.
 */

export const StyledPersonIcon = styled(PersonOutlined)(({ theme }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.text.primary : '#666666',
}));

export const StyledDashboardIcon = styled(DashboardOutlined)(({ theme }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.text.primary : '#666666',
}));

export const StyledInboxIcon = styled(InboxOutlined)(({ theme }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.text.primary : '#666666',
}));

export const StyledFavoriteIcon = styled(FavoriteBorderOutlined)(({ theme }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.text.primary : '#666666',
}));

export const StyledLogoutIcon = styled(Logout)(({ theme }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.text.primary : '#666666',
}));

export const StyledHomeIcon = styled(HomeOutlined)({
    color: '#666666',
});

export const StyledMoveToInboxIcon = styled(MoveToInboxOutlined)({
    color: '#666666',
});

export const StyledShoppingCartIcon = styled(ShoppingCartOutlined)({
    color: '#666666',
});

export const StyledNotificationsIcon = styled(Notifications)({
    color: '#666666',
});

const activeColor = '#7C7164';

export const CustomProfileIcon = ({ isActive }) => <Person style={{ color: isActive ? activeColor : 'inherit' }} />;
export const CustomAddressIcon = ({ isActive }) => <Home style={{ color: isActive ? activeColor : 'inherit' }} />;
export const CustomOrdersIcon = ({ isActive }) => <Inbox style={{ color: isActive ? activeColor : 'inherit' }} />;
export const CustomReturnIcon = ({ isActive }) => <MoveToInbox style={{ color: isActive ? activeColor : 'inherit' }} />;
export const CustomWishlistIcon = ({ isActive }) => <Favorite style={{ color: isActive ? activeColor : 'inherit' }} />;
export const CustomReviewsIcon = ({ isActive }) => <Star style={{ color: isActive ? activeColor : 'inherit' }} />;

export const CreateIcon = ({ theme }) => (
    <Create sx={{ color: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'inherit' }} />
);

export const VisibilityIcon = ({ theme }) => (
    <Visibility sx={{ color: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'inherit' }} />
);

export const DownloadIcon = ({ theme }) => {
    return <Download style={{ color: theme.palette.icon.main }} className="mr-2 text-stone-600" />
};

export const DescriptionIcon = ({ theme }) => {
    return <Description style={{ color: theme.palette.icon.main }} className="mr-2 text-stone-600" />
};

export const DataObjectIcon = ({ theme }) => {
    return <DataObject style={{ color: theme.palette.icon.main }} className="mr-2 text-stone-600" />
};

export const BrownShoppingCartIcon = styled(ShoppingCart)({
    color: '#57534E',
    transition: 'color 0.3s ease',
});

export const DeleteButtonIcon = styled(Delete)({
    color: '#57534E',
    transition: 'color 0.3s ease',
});

export const BrownDeleteOutlinedIcon = styled(DeleteOutlined)({
    color: '#57534E',
    '&:hover': {
        cursor: 'pointer',
    }
});

export function HomeBreadCrumbIcon(props) {
    return (
        <SvgIcon {...props} style={{ fontSize: 17, marginBottom: 0.7 }}>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </SvgIcon>
    );
};

export const CenteredMoreVertIcon = ({ onClick, ...props }) => (
    <Box display="flex" justifyContent="center" alignItems="center" {...props}>
        <IconButton onClick={onClick}>
            <MoreVert />
        </IconButton>
    </Box>
);

export const AccountLinkStatusIcon = ({ hasId }) => {
    return (
        <>
            {hasId ? (
                <Check style={{ color: green[500], marginRight: 8 }} />
            ) : (
                <Clear style={{ color: red[500], marginRight: 8 }} />
            )}
        </>
    );
};

export const ProfileIcon = ({ handleProfileDropdownToggle, isDropdownOpen }) => {
    const theme = useTheme();

    const { user, loading } = useSelector((state) => state.auth);

    return (
        <div className="flex items-center">
            <ProfileButton
                onMouseDown={handleProfileDropdownToggle}
                isDropdownOpen={isDropdownOpen}
                centerRipple={false}
            >
                {loading ? (
                    <WaveSkeleton variant="circle" width={50} height={20} className="mr-1 rounded-md" />
                ) : (
                    <img
                        src={user?.profilePicture}
                        alt={`${user?.firstName}'s profile`}
                        className="w-[26px] h-[26px] rounded-full object-cover"
                    />
                )}
                {loading ? (
                    <WaveSkeleton variant="text" width={80} height={20} className="ml-2" />
                ) : (
                    user?.firstName && (
                        <span
                            style={profileIconSx(theme)}
                            className="text-sm overflow-hidden text-ellipsis ml-2"
                        >
                            {user.firstName}
                        </span>
                    )
                )}
            </ProfileButton>
        </div>
    );
};

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

export const WishlistIcon = ({ totalQuantity }) => {
    const navigate = useNavigate();

    const handleWishlistClick = () => {
        navigate('/profile/wishlist');
    };

    return (
        <RoundIconButton onClick={handleWishlistClick}>
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
            >
                <StyledFavoriteIcon />
            </Badge>
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

export const NotificationIcon = ({ unreadCount, handleNotifDropdownToggle, isDropdownOpen }) => {
    return (
        <RoundIconButton aria-label="notification" onMouseDown={handleNotifDropdownToggle}>
            <Badge
                badgeContent={unreadCount}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{
                    '& .MuiBadge-badge': {
                        backgroundColor: '#7C7164',
                        color: 'white',
                    },
                }}
                showZero
            >
                {isDropdownOpen ? <StyledNotificationsIcon component={Notifications} /> : <StyledNotificationsIcon component={NotificationsOutlined} />}
            </Badge>
        </RoundIconButton>
    );
};

export const MarkAllReadIcon = () => {
    return (
        <MarkEmailRead className='text-stone-600' />
    );
};

export const MarkAllUnreadIcon = () => {
    return (
        <MarkEmailUnread className='text-stone-600' />
    );
};

export const UnarchiveAllIcon = () => {
    return (
        <Unarchive className='text-stone-600' />
    );
};

export const ArchiveAllIcon = () => {
    return (
        <Archive className='text-stone-600' />
    );
};

export const CollapseIcon = ({ toggleDrawer }) => {
    return (
        <IconButton onClick={toggleDrawer}>
            <ChevronLeft />
        </IconButton>
    );
};

export const ExtendIcon = ({ toggleDrawer, open }) => {
    return (
        <IconButton
            edge="start"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{ ...(open && { display: 'none' }) }}
            className='mr-36'
        >
            <MenuIcon />
        </IconButton>
    );
};

export const OTPIcon = ({ isAuthenticator, twoFactorMethods }) => {
    return (
        <div className="flex items-center justify-center mb-4">
            <div className="bg-stone-100 p-3 rounded-full">
                {isAuthenticator || (twoFactorMethods.includes('authenticator') && !twoFactorMethods.includes('email')) ? (
                    <Lock className="w-6 h-6 text-stone-600" />
                ) : (
                    <Mail className="w-6 h-6 text-stone-600" />
                )}
            </div>
        </div>
    );
};