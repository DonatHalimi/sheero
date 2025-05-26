import { CheckCircle, Download, Facebook, Google, GppGood, InfoOutlined, Lock, Mail, Search } from "@mui/icons-material";
import { Box, Button, Divider, MenuItem, Select, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { headerFilterSx, headerSearchSx, layoutContainerSx, profileDropdownButtonSx, profileDropdownContainerSx, profileLayoutSx } from "../../assets/sx";
import ProfileSidebar from "../../pages/Profile/ProfileSidebar";
import { disable2faService, enable2faService, enableAuthenticator2FAService, getExistingSecretService } from "../../services/authService";
import { getApiUrl } from "../../utils/config";
import { StyledDashboardIcon, StyledFavoriteIcon, StyledInboxIcon, StyledLogoutIcon, StyledPersonIcon } from "./Icons";
import { LoadingOverlay, WaveSkeleton } from "./LoadingSkeletons";
import { BrownButton, ClearWishlist, CustomBox, CustomModal, DropdownAnimation, OutlinedBrownButton, RoundIconButton, ShareWishlist } from "./MUI";
import { useScrollAwayMenu } from "./Splide";
import { truncateText } from "./utils";

/**
 * @file Profile.jsx
 * @description A collection of custom components related to user profile display and management.
 *
 * This file includes components for rendering user profile information, handling profile updates and
 * managing profile-related interactions to ensure a cohesive user experience across the application.
 */

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
    isUserData = false,
    isReturnDetails = false,
    hasAddress = false,
    openReturnModal,
    onDownloadOrder,
    onDownloadUserData,
    onDownloadReturn,
    onDownloadAddress,
}) => {
    const { open, menuRef, menuProps, menuHandlers } = useScrollAwayMenu();
    const isSharedWishlist = fullName.trim() !== '';

    const getStatusOptions = () => {
        switch (filterType) {
            case 'orders':
                return [
                    { value: 'All', label: 'All' },
                    { value: 'pending', label: 'Pending' },
                    { value: 'shipped', label: 'Shipped' },
                    { value: 'delivered', label: 'Delivered' },
                    { value: 'canceled', label: 'Canceled' },
                ];
            case 'returns':
                return [
                    { value: 'All', label: 'All' },
                    { value: 'pending', label: 'Pending' },
                    { value: 'approved', label: 'Approved' },
                    { value: 'processed', label: 'Processed' },
                    { value: 'rejected', label: 'Rejected' },
                ];
            case 'reviews':
                return [
                    { value: 'All', label: 'All' },
                    { value: '1', label: '1+' },
                    { value: '2', label: '2+' },
                    { value: '3', label: '3+' },
                    { value: '4', label: '4+' },
                    { value: '5', label: '5' },
                ];
            default:
                return [];
        }
    };

    return (
        <div className="bg-white p-4 rounded-md shadow-sm mb-4 flex justify-between items-center">
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
                        sx={headerSearchSx}
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
                            sx={headerFilterSx}
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
                    <>
                        <OutlinedBrownButton
                            onClick={onDownloadOrder}
                            startIcon={<Download />}
                        >
                            Download Order
                        </OutlinedBrownButton>
                        <BrownButton variant="contained" onClick={openReturnModal}>
                            Request Return
                        </BrownButton>
                    </>
                )}
                {isUserData && (
                    <OutlinedBrownButton
                        onClick={onDownloadUserData}
                        startIcon={<Download />}
                    >
                        Download Data
                    </OutlinedBrownButton>
                )}
                {isReturnDetails && (
                    <OutlinedBrownButton
                        onClick={onDownloadReturn}
                        startIcon={<Download />}
                    >
                        Download Return
                    </OutlinedBrownButton>
                )}
                {hasAddress && (
                    <OutlinedBrownButton
                        onClick={onDownloadAddress}
                        startIcon={<Download />}
                    >
                        Download Address
                    </OutlinedBrownButton>
                )}
                {wishlistItems && !isSharedWishlist && wishlistItems.length > 0 && (
                    <>
                        <ShareWishlist handleShareWishlist={handleShareWishlist} loading={loading} />
                        <ClearWishlist setIsModalOpen={setIsModalOpen} loading={loading} />
                    </>
                )}
            </div>
        </div>
    );
};

export const ProfileLayout = ({ children }) => {
    return (
        <Box sx={profileLayoutSx}>
            <ProfileSidebar />
            <Box
                component="main"
                sx={layoutContainerSx}
            >
                {children}
            </Box>
        </Box>
    );
};

export const handleGoogleLogin = async () => {
    try {
        window.location.href = getApiUrl('/auth/google');
    } catch (error) {
        console.error('Google authentication error:', error);
        toast.error('Failed to authenticate with Google');
    }
};

export const handleFacebookLogin = async () => {
    try {
        window.location.href = getApiUrl('/auth/facebook');
    } catch (error) {
        console.error('Facebook authentication error:', error);
        toast.error('Failed to authenticate with Facebook');
    }
};

export const SocialLoginButtons = ({ handleGoogleLogin, handleFacebookLogin, isRegisterPage = false }) => {
    return (
        <>
            <div className={`flex items-center mt-4 ${isRegisterPage ? '!mb-4' : '!mb-4'}`}>
                <Divider className="flex-1" />
                <Typography variant="body2" className="!mx-2 text-gray-500">or</Typography>
                <Divider className="flex-1" />
            </div>

            <BrownButton
                fullWidth
                variant="outlined"
                onClick={handleGoogleLogin}
                className="!mb-4 !flex !items-center !justify-center"
            >
                <Google className="mr-2" />
                Sign in with Google
            </BrownButton>

            <BrownButton
                fullWidth
                variant="outlined"
                onClick={handleFacebookLogin}
                className="!mb-4 !flex !items-center !justify-center"
            >
                <Facebook className="mr-2" />
                Sign in with Facebook
            </BrownButton>
        </>
    );
};

export const ProfileDropdown = ({
    isOpen,
    isAdmin,
    isOrderManager,
    isContentManager,
    isProductManager,
    handleLogout,
}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleNavigate = (path) => navigate(path);

    const getButtonClasses = () => `flex items-center px-2 py-2 no-underline w-full text-left rounded-md ${theme.palette.mode === 'light' ? 'hover:bg-gray-100' : 'hover:bg-[#474646]'}`;

    const renderUserDetails = () => (
        <div className="flex items-center mt-1 mb-2 px-1">
            <img src={user.profilePicture} alt="Profile" className="w-8 h-8 rounded-full mr-[10px]" />
            <div className="flex flex-col overflow-hidden">
                <span className="font-medium">{user.firstName}</span>
                <span className="text-sm text-gray-500">{truncateText(user.email, 18)}</span>
            </div>
        </div>
    );

    const renderDashboardButton = (path, label, Icon) => (
        <button
            onClick={() => handleNavigate(path)}
            style={profileDropdownButtonSx(theme)}
            className={getButtonClasses()}
        >
            <Icon className="mr-2" />
            {label}
        </button>
    );

    const renderDropdownItem = (pathOrFn, label, Icon, hasMargin = false) => {
        const isFn = typeof pathOrFn === 'function';
        return (
            <button
                onClick={() => isFn ? pathOrFn() : handleNavigate(pathOrFn)}
                style={profileDropdownButtonSx(theme)}
                className={`${getButtonClasses()} ${hasMargin ? 'mb-2' : ''}`}
            >
                <Icon className="mr-2" />
                {label}
            </button>
        );
    };

    const hasDashboardAccess = isAdmin || isOrderManager || isContentManager || isProductManager;

    return (
        <div
            tabIndex="0"
            style={profileDropdownContainerSx(theme)}
            className="absolute right-0 mt-1 w-52 border shadow-lg rounded-lg p-2"
        >
            <DropdownAnimation isOpen={isOpen}>
                {renderUserDetails()}

                {renderDropdownItem('/profile/me', 'Profile', StyledPersonIcon)}

                <Divider className='!mt-2 !mb-2' />

                {hasDashboardAccess && (
                    <>
                        {isAdmin && renderDashboardButton('/dashboard/users', 'Dashboard', StyledDashboardIcon)}
                        {isOrderManager && renderDashboardButton('/dashboard/orders', 'Orders', StyledDashboardIcon)}
                        {isContentManager && renderDashboardButton('/dashboard/images', 'Images', StyledDashboardIcon)}
                        {isProductManager && renderDashboardButton('/dashboard/products', 'Products', StyledDashboardIcon)}
                    </>
                )}

                {renderDropdownItem('/profile/orders', 'Orders', StyledInboxIcon)}
                {renderDropdownItem('/profile/wishlist', 'Wishlist', StyledFavoriteIcon, true)}

                <Divider className='!mb-2' />

                {renderDropdownItem(handleLogout, 'Logout', StyledLogoutIcon)}
            </DropdownAnimation>
        </div>
    );
};

export const TwoFactorButton = ({ is2faLoading, onClick }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (isMobile) {
        return (
            <RoundIconButton
                size="small"
                onClick={onClick}
                disabled={is2faLoading}
                sx={{
                    p: 0.5,
                    color: '#5B504B',
                    '&:hover': { bg: theme.palette.action.hover },
                }}
            >
                <Lock fontSize="small" />
            </RoundIconButton>
        );
    }

    return (
        <BrownButton
            onClick={onClick}
            disabled={is2faLoading}
        >
            <Typography
                variant="button"
            >
                <Lock fontSize="small" sx={{ mr: 1 }} />
                Manage
            </Typography>
        </BrownButton>
    );
};

export const TwoFactorOptions = ({
    handleEmailAuth,
    handleAuthenticatorSetup,
    hasEmail2FA,
    hasAuthenticator2FA,
    getEmailButtonText,
    getAuthenticatorButtonText
}) => {
    const emailDescription = hasEmail2FA
        ? "Email 2FA is currently enabled. Click to disable this security method"
        : "Receive one-time codes via email for secure account access";

    const authenticatorDescription = hasAuthenticator2FA
        ? "Authenticator app is currently enabled. Click to disable this security method"
        : "Receive one-time codes via authenticator app for secure account access";

    const getButtonClasses = (isEnabled) =>
        `w-full border rounded-lg p-4 cursor-pointer transition-all flex flex-col items-center text-center shadow-sm ${isEnabled
            ? "hover:border-red-500 hover:bg-red-50 border-gray-200"
            : "hover:border-stone-600 border-gray-200"
        }`;

    return (
        <div className="flex flex-col sm:flex-row justify-between gap-5 py-1 mt-2">
            <div
                onClick={handleEmailAuth}
                className={getButtonClasses(hasEmail2FA)}
            >
                <Mail className="text-stone-500 mb-2" />
                <h2 className="text-lg font-semibold mb-1">{getEmailButtonText()}</h2>
                <p className="text-gray-600 text-sm">
                    {emailDescription}
                </p>
            </div>
            <div
                onClick={handleAuthenticatorSetup}
                className={getButtonClasses(hasAuthenticator2FA)}
            >
                <GppGood className="text-stone-500 mb-2" />
                <h2 className="text-lg font-semibold mb-1">{getAuthenticatorButtonText()}</h2>
                <p className="text-gray-600 text-sm">
                    {authenticatorDescription}
                </p>
            </div>
        </div>
    );
};

export const Authenticator2FASetup = ({ user, secretKey, qrImageUrl, setShowQRCode, isLoading }) => {
    const navigate = useNavigate();

    const setupDescription = (
        <div className="space-y-2">
            <div className="flex items-start">
                <CheckCircle fontSize="small" className="text-stone-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm">
                    Open your authenticator app and scan the QR code with your camera.
                </p>
            </div>
            <div className="flex items-start">
                <CheckCircle fontSize="small" className="text-stone-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm">
                    Click continue to verify by entering the one-time password from your authenticator app.
                </p>
            </div>
            <div className="flex items-start">
                <CheckCircle fontSize="small" className="text-stone-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm">
                    After verifying, you will use the app to input the one-time password each time you log in for extra security.
                </p>
            </div>
            <div className="flex items-start !mt-4">
                <InfoOutlined fontSize="small" className="text-stone-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-left">
                    If you don't have access to your camera, you can enter this code in your chosen authenticator app:
                    <br />
                    <span className="text-stone-600 break-all">{secretKey}</span>
                </p>
            </div>
        </div>
    );

    const handleClick = (user, secretKey, navigate) => {
        if (!user?.email) {
            console.error("User email is missing");
            return;
        }
        navigate('/verify-otp', {
            state: {
                email: user.email,
                action: 'enable',
                method: 'authenticator',
                isAuthenticator: true,
                secretKey
            }
        });
    };

    const QRCodeValue = `otpauth://totp/sheero:${user?.email}?secret=${secretKey}&issuer=sheero`;

    return (
        <>
            <Typography variant="h6">Authenticator Setup</Typography>

            <div className='text-center'>
                {qrImageUrl ? (
                    <img src={qrImageUrl} alt="QR Code" className='mx-auto w-[70%]' />
                ) : (
                    <QRCodeSVG value={QRCodeValue} size={200} className='mx-auto' />
                )}
            </div>

            <div className='text-align !mb-4 !text-sm'>
                {setupDescription}
            </div>

            <div className='flex gap-3 !mt-2'>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setShowQRCode(false)}
                    disabled={isLoading}
                >
                    Back
                </Button>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleClick(user, secretKey, navigate)}
                >
                    Continue
                </Button>
            </div>
        </>
    );
};

export const TwoFactorModal = ({ open, onClose }) => {
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const [showQRCode, setShowQRCode] = useState(false);
    const [secretKey, setSecretKey] = useState("");
    const [qrImageUrl, setQrImageUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const is2faEnabled = user?.twoFactorEnabled || false;
    const hasEmail2FA = user?.twoFactorMethods?.includes('email');
    const hasAuthenticator2FA = user?.twoFactorMethods?.includes('authenticator');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        if (open) {
            setShowQRCode(false);
            setSecretKey("");
            setQrImageUrl("");
        }
    }, [open]);

    const handleEmailAuth = async () => {
        setIsLoading(true);
        try {
            if (hasEmail2FA) {
                const response = await disable2faService();
                if (response.data.disableOtpPending) {
                    navigate('/verify-otp', {
                        state: {
                            email: user.email,
                            action: 'disable',
                            method: 'email'
                        }
                    });
                }
            } else {
                const response = await enable2faService();
                if (response.data.success) {
                    navigate('/verify-otp', {
                        state: {
                            email: response.data.email,
                            action: 'enable',
                            method: 'email'
                        }
                    });
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || `Failed to ${hasEmail2FA ? 'disable' : 'enable'} email 2FA`);
        } finally {
            setIsLoading(false);
            onClose();
        }
    };

    const handleAuthenticatorSetup = async () => {
        if (hasAuthenticator2FA) {
            setIsLoading(true);
            try {
                navigate('/verify-otp', {
                    state: {
                        email: user.email,
                        action: 'disable',
                        method: 'authenticator',
                        isAuthenticator: true
                    }
                });
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to disable authenticator');
            } finally {
                setIsLoading(false);
            }
            return;
        }

        setIsLoading(true);
        try {
            const response = user?.twoFactorSecret && !showQRCode
                ? await getExistingSecretService()
                : await enableAuthenticator2FAService();

            setQrImageUrl(response.data.imageUrl);
            setSecretKey(response.data.secret);
            setShowQRCode(true);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to set up authenticator app.');
        } finally {
            setIsLoading(false);
        }
    };

    const getModalTitle = () => {
        return is2faEnabled ? "Manage Two-Factor Authentication" : "Enable Two-Factor Authentication";
    };

    const getEmailButtonText = () => {
        return hasEmail2FA ? "Disable Email 2FA" : "Enable Email 2FA";
    };

    const getAuthenticatorButtonText = () => {
        return hasAuthenticator2FA ? "Disable Auth 2FA" : "Enable Auth 2FA";
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            {isLoading && <LoadingOverlay />}
            <CustomBox>
                {!showQRCode ? (
                    <>
                        <Box className="flex items-center gap-3">
                            <Typography
                                variant={isMobile ? 'subtitle1' : 'h6'}
                                align="center"
                                className="!mb-2"
                            >
                                {getModalTitle()}
                            </Typography>
                            <p className={`text-sm bg-stone-50 rounded-md px-2 ${is2faEnabled ? 'text-green-500' : 'text-red-500'}`}>
                                {is2faEnabled ? 'Enabled' : 'Disabled'}
                            </p>
                        </Box>

                        <TwoFactorOptions
                            handleEmailAuth={handleEmailAuth}
                            handleAuthenticatorSetup={handleAuthenticatorSetup}
                            hasEmail2FA={hasEmail2FA}
                            hasAuthenticator2FA={hasAuthenticator2FA}
                            getEmailButtonText={getEmailButtonText}
                            getAuthenticatorButtonText={getAuthenticatorButtonText}
                        />
                    </>
                ) : (
                    <Authenticator2FASetup
                        user={user}
                        qrImageUrl={qrImageUrl}
                        secretKey={secretKey}
                        showQRCode={showQRCode}
                        setShowQRCode={setShowQRCode}
                    />
                )}
            </CustomBox>
        </CustomModal>
    );
};