import {
    Close,
    DarkMode,
    Delete,
    Download,
    ExpandMore,
    InfoOutlined,
    KeyboardArrowUp,
    KeyboardReturn,
    LightMode,
    MoreHoriz, MoreVert,
    Search,
    SearchOff,
    UploadFile
} from "@mui/icons-material";
import {
    Box,
    Button,
    Chip,
    ClickAwayListener,
    IconButton,
    InputAdornment,
    InputBase,
    List,
    ListItem,
    Menu,
    MenuItem,
    Modal,
    TextField,
    Toolbar,
    Tooltip,
    Typography,
    useTheme
} from "@mui/material";
import { animate, AnimatePresence, motion } from "framer-motion";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useLocation } from "react-router-dom";
import {
    addItemSx,
    chipSx,
    customBoxSx,
    dashboardAppBarSx,
    dashboardHeaderSx,
    dashboardSearchBoxSx,
    dashboardSearchHintBarSx,
    dashboardSearchLabelSx,
    dashboardSearchSuggestionsBoxSx,
    dashboardSearchSuggestionsSx,
    dashboardSearchTextSx,
    dashboardTitleSx,
    dashboardToolBarSx,
    deleteItemSx, exportIconSx,
    formSubmitSx,
    keyboardKeySx
} from "../../assets/sx";
import { getImageUrl } from "../../utils/config";
import { useDashboardTheme } from "../../utils/ThemeContext";
import {
    CreateIcon,
    DataObjectIcon,
    DescriptionIcon,
    DownloadIcon,
    ExtendIcon,
    ProfileIcon,
    VisibilityIcon
} from "./Icons";
import { LoadingLabel } from "./LoadingSkeletons";
import {
    AppBar,
    BrownButton,
    CustomModal,
    CustomTypography,
    DrawerTypography,
    KeyboardKey,
    LoginButton,
    NavbarLogo,
    OutlinedBrownButton,
    VisuallyHiddenInput
} from "./MUI";
import { ProfileDropdown } from "./Profile";
import { getLocalStorageState, pluralize, saveLocalStorageState } from "./utils";

/**
 * @file Dashboard.jsx
 * @description A collection of custom components specifically for the Dashboard page.
 *
 * This file includes reusable components that are designed to structure and organize the dashboard's layout and functionality.
 */

export const ActionButtons = ({
    primaryButtonLabel,
    secondaryButtonLabel,
    onPrimaryClick,
    onSecondaryClick,
    isFormValid,
    primaryButtonProps = {},
    secondaryButtonProps = {},
    gap = 20,
    width = 200,
    loading = false,
}) => {
    return (
        <Box style={{ gap: `${gap}px` }} className="flex">
            <OutlinedBrownButton
                onClick={onSecondaryClick}
                variant="outlined"
                color="primary"
                style={{ width: `${width}px` }}
                disabled={loading}
                {...secondaryButtonProps}
            >
                {secondaryButtonLabel}
            </OutlinedBrownButton>

            <BrownButton
                onClick={onPrimaryClick}
                variant="contained"
                color="primary"
                isFormValid={isFormValid}
                style={{ width: `${width}px` }}
                disabled={loading}
                {...primaryButtonProps}
            >
                <LoadingLabel
                    loading={loading}
                    defaultLabel={primaryButtonLabel}
                    loadingLabel={'Saving'}
                />
            </BrownButton>
        </Box>
    );
};

export const FormSubmitButtons = ({
    isEdit,
    onViewDetails,
    submitForm,
    isDisabled,
    loading,
    item,
    onClose
}) => {
    const theme = useTheme();

    if (isEdit && onViewDetails) {
        return (
            <ActionButtons
                primaryButtonLabel="Save"
                secondaryButtonLabel="View Details"
                onPrimaryClick={submitForm}
                onSecondaryClick={() => {
                    onViewDetails(item);
                    onClose();
                }}
                primaryButtonProps={{
                    disabled: isDisabled,
                    sx: formSubmitSx(theme),
                }}
                loading={loading}
            />
        );
    }

    return (
        <BrownButton
            onClick={submitForm}
            disabled={isDisabled}
            className="w-full"
            sx={formSubmitSx(theme)}
        >
            <LoadingLabel loading={loading} />
        </BrownButton>
    );
};

export const TitleActions = ({
    onEdit,
    onDelete,
    onExport,
    showEditButton = true,
}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const theme = useTheme();
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event) => {
        if (event) event.stopPropagation();
        setAnchorEl(null);
    };

    const handleEdit = (event) => {
        event.stopPropagation();
        if (onEdit) onEdit();
        handleClose();
    };

    const handleDelete = (event) => {
        event.stopPropagation();
        if (onDelete) onDelete();
        handleClose();
    };

    const handleExport = (event) => {
        event.stopPropagation();
        if (onExport) onExport();
        handleClose();
    };

    return (
        <div>
            <IconButton onClick={handleClick} size="small">
                <MoreHoriz />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={(e) => e.stopPropagation()}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                elevation={1}
                sx={{ zIndex: 99999 }}
                container={document.body}
            >
                {showEditButton && (
                    <MenuItem onClick={handleEdit}>
                        <CreateIcon theme={theme} />
                        <span className='ml-2'>Edit</span>
                    </MenuItem>
                )}

                {onExport && (
                    <MenuItem onClick={handleExport}>
                        <Download theme={theme} />
                        <span className='ml-2'>Export</span>
                    </MenuItem>
                )}

                <MenuItem
                    onClick={handleDelete}
                    sx={{ '&:hover': { backgroundColor: 'rgba(255, 0, 0, 0.05)' } }}
                >
                    <Delete theme={theme} className='text-red-500' />
                    <span className='ml-2 text-red-500'>Delete</span>
                </MenuItem>
            </Menu>
        </div>
    );
};

export const DetailsTitle = ({
    entityName,
    handleEdit,
    handleDelete,
    handleExport,
    handleView,
    showEditButton = true,
}) => {
    return (
        <div className='flex items-center gap-4'>
            <Typography className="!font-bold !text-lg">
                {entityName} Details
            </Typography>
            <TitleActions
                onEdit={handleEdit}
                onDelete={handleDelete}
                onExport={handleExport}
                onView={handleView}
                showEditButton={showEditButton}
            />
        </div>
    );
};

export const DropdownMenu = ({ open, onClose, options, anchorEl }) => {
    const theme = useTheme();

    return (
        <Menu
            open={open}
            onClose={onClose}
            anchorEl={anchorEl}
            elevation={1}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            {options.map((option, index) => (
                <MenuItem
                    key={index}
                    onClick={() => {
                        option.onClick();
                        onClose();
                    }}
                    autoFocus={false}
                >
                    {option.label === "Export as Excel" && <DownloadIcon theme={theme} />}
                    {option.label === "Export as CSV" && <DescriptionIcon theme={theme} />}
                    {option.label === "Export as JSON" && <DataObjectIcon theme={theme} />}
                    {option.label}
                </MenuItem>
            ))}
        </Menu>
    );
};

export const exportOptions = (data, handleExport) => [
    { label: 'Export as Excel', onClick: () => handleExport(data, 'excel') },
    { label: 'Export as CSV', onClick: () => handleExport(data, 'csv') },
    { label: 'Export as JSON', onClick: () => handleExport(data, 'json') }
];

export const DashboardHeader = ({
    title,
    selectedItems = [],
    setAddItemOpen,
    setDeleteItemOpen,
    exportOptions = [],
    itemName,
    showAddButton = true,
}) => {
    const { theme } = useDashboardTheme();

    const isMultipleSelected = selectedItems.length > 1;
    const itemNamePlural = pluralize(itemName, selectedItems.length);

    const [anchorEl, setAnchorEl] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [helpOpen, setHelpOpen] = useState(false);

    const handleScrollToTop = () => {
        const mainContent = document.querySelector('[role="main"]');
        if (!mainContent) return;

        animate(mainContent.scrollTop, 0, {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
            onUpdate(latest) {
                mainContent.scrollTop = latest;
            },
        });
    };

    useHotkeys('alt+i', (e) => {
        e.preventDefault();
        setHelpOpen((prev) => !prev);
    });

    return (
        <div
            style={dashboardHeaderSx(theme)}
            className="sticky top-16 z-50 p-4 flex items-center justify-between w-full mb-4 rounded-md shadow-sm border-b"
        >
            <div className="flex items-center">
                <Tooltip title="Scroll to top" arrow>
                    <Button onClick={handleScrollToTop} sx={dashboardTitleSx(theme)}>
                        {title}
                    </Button>
                </Tooltip>

                <Tooltip title="Keyboard shortcuts" arrow>
                    <IconButton
                        onClick={() => setHelpOpen(true)}
                        sx={{ color: theme.palette.text.secondary }}
                    >
                        <InfoOutlined fontSize="small" />
                    </IconButton>
                </Tooltip>
            </div>

            <div>
                {showAddButton && (
                    <OutlinedBrownButton
                        onClick={() => setAddItemOpen(true)}
                        sx={addItemSx(theme)}
                        className="!mr-3"
                    >
                        Add {itemName}
                    </OutlinedBrownButton>
                )}
                {selectedItems.length > 0 && (
                    <OutlinedBrownButton
                        onClick={() => setDeleteItemOpen(true)}
                        sx={deleteItemSx(theme)}
                    >
                        {isMultipleSelected ? `Delete ${itemNamePlural}` : `Delete ${itemName}`}
                    </OutlinedBrownButton>
                )}

                <IconButton onClick={(e) => {
                    setAnchorEl(e.currentTarget);
                    setDropdownOpen((o) => !o);
                }}
                    sx={exportIconSx(theme)}
                >
                    <MoreVert />
                </IconButton>
            </div>

            <KeyboardShortcutsHelp
                open={helpOpen}
                onClose={() => setHelpOpen(false)}
                theme={theme}
            />

            <DropdownMenu
                open={dropdownOpen}
                onClose={() => {
                    setDropdownOpen(false);
                    setAnchorEl(null);
                }}
                options={exportOptions}
                anchorEl={anchorEl}
            />
        </div>
    );
};

export const KeyboardShortcutsHelp = ({ open, onClose, theme }) => {
    const shortcutGroupTitles = ['Table Navigation', 'Table Actions', 'Application Shortcuts'];

    const shortcutGroups = shortcutGroupTitles.map(title => ({
        title,
        shortcuts: title === 'Table Navigation' ? [
            { keys: ['↑', '↓'], action: 'Navigate between items' },
            { keys: ['Shift+↑', 'Shift+↓'], action: 'Select while navigating' },
            { keys: ['Enter'], action: 'View details (when 1 item is selected or focused)' },
            { keys: ['Escape'], action: 'Clear selection or navigation focus' },
            { keys: ['Space', 'Shift+Enter'], action: 'Toggle selection' },
            { keys: ['Ctrl+Shift+A'], action: 'Select all items' },
        ] : title === 'Table Actions' ? [
            { keys: ['Alt+A'], action: 'Add new item' },
            { keys: ['Alt+E'], action: 'Edit selected or focused item' },
            { keys: ['Alt+D'], action: 'Delete selected items' },
        ] : [
            { keys: ['['], action: 'Toggle sidebar' },
            { keys: ['Ctrl+K'], action: 'Search items' },
            { keys: ['Alt+T'], action: 'Toggle theme' },
            { keys: ['Alt+I'], action: 'Toggle keyboard shortcuts help' },
        ]
    }));

    const [expandedGroups, setExpandedGroups] = useState(() => {
        const initialState = {};
        shortcutGroupTitles.forEach(title => initialState[title] = true);
        return getLocalStorageState('expandedGroupsState', initialState);
    });

    const toggleGroup = (groupTitle) => {
        setExpandedGroups(prev => {
            const newState = { ...prev, [groupTitle]: !prev[groupTitle] };
            saveLocalStorageState('expandedGroupsState', newState);
            return newState;
        });
    };
    const containerVariants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1, y: 0,
            transition: { type: "spring", stiffness: 300, damping: 24 }
        },
        exit: {
            opacity: 0, y: -10,
            transition: { duration: 0.2 }
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <Box sx={customBoxSx(theme, true)} className="p-3 w-[700px] max-w-full rounded-md">
                <CustomTypography variant="h6" className='!mb-[-2px]'>Keyboard Shortcuts</CustomTypography>
                <List>
                    {shortcutGroups.map((group) => (
                        <div key={group.title}>
                            <ListItem
                                button
                                onClick={() => toggleGroup(group.title)}
                                component={motion.div}
                                layout
                                className='group !p-2 !rounded-md hover:bg-gray-100'
                            >
                                <Box className="flex items-center justify-between w-full">
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ color: theme.palette.text.secondary }}
                                        className="font-extrabold uppercase tracking-wide"
                                    >
                                        {group.title}
                                    </Typography>
                                    <motion.div
                                        animate={{ rotate: expandedGroups[group.title] ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center"
                                    >
                                        <KeyboardArrowUp fontSize="small" style={{ color: theme.palette.text.secondary }} />
                                    </motion.div>
                                </Box>
                            </ListItem>

                            <AnimatePresence initial={false}>
                                <motion.div
                                    key={expandedGroups[group.title] ? 'open' : 'closed'}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={expandedGroups[group.title] ? { height: 'auto', opacity: 1 } : {}}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                                    style={{ overflow: 'hidden' }}
                                >
                                    {expandedGroups[group.title] && (
                                        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="hidden">
                                            {group.shortcuts.map((shortcut, index) => (
                                                <motion.div key={index} variants={itemVariants}>
                                                    <ListItem className='!py-2 !pl-2'>
                                                        <Box className="flex items-center w-full gap-1">
                                                            <Box className="flex flex-wrap items-center gap-1.5">
                                                                {shortcut.keys.map((key, i) => (
                                                                    <Fragment key={i}>
                                                                        {key.split('+').map((part, j) => (
                                                                            <Fragment key={j}>
                                                                                <KeyboardKey theme={theme}>
                                                                                    <Box component="span" sx={keyboardKeySx(theme)}>{part}</Box>
                                                                                </KeyboardKey>
                                                                                {j < key.split('+').length - 1 && (
                                                                                    <Box component="span" sx={{ color: theme.palette.text.primary }}>+</Box>
                                                                                )}
                                                                            </Fragment>
                                                                        ))}
                                                                        {i < shortcut.keys.length - 1 && (
                                                                            <Box component="span" sx={{ color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                                                                                or
                                                                            </Box>
                                                                        )}
                                                                    </Fragment>
                                                                ))}
                                                            </Box>
                                                            <Typography variant="body2" component="span" style={{ color: theme.palette.text.primary }}>
                                                                {shortcut.action}
                                                            </Typography>
                                                        </Box>
                                                    </ListItem>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    ))}
                </List>
            </Box>
        </CustomModal>
    );
};

export const ActionsCell = ({ row, theme, onViewDetails, onEdit, onDelete, showEditButton }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event) => {
        event.stopPropagation();
        setAnchorEl(null);
    };

    const handleView = (event) => {
        event.stopPropagation();
        if (onViewDetails) onViewDetails(row);
        setAnchorEl(null);
    };

    const handleEdit = (event) => {
        event.stopPropagation();
        if (onEdit) onEdit(row);
        setAnchorEl(null);
    };

    const handleDelete = (event) => {
        event.stopPropagation();
        if (onDelete) onDelete(row);
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton onClick={handleClick} size="small">
                <MoreHoriz />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={(e) => e.stopPropagation()}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                elevation={1}
                PaperProps={{ sx: { minWidth: 100 } }}
            >
                {showEditButton && (
                    <MenuItem onClick={handleEdit}>
                        <CreateIcon theme={theme} />
                        <span className='ml-2'>Edit</span>
                    </MenuItem>
                )}
                <MenuItem onClick={handleView}>
                    <VisibilityIcon theme={theme} />
                    <span className='ml-2'>View</span>
                </MenuItem>
                <MenuItem
                    onClick={handleDelete}
                    sx={{ '&:hover': { backgroundColor: 'rgba(255, 0, 0, 0.05)' } }}
                >
                    <Delete theme={theme} className='text-red-500' />
                    <span className='ml-2 text-red-500'>Delete</span>
                </MenuItem>
            </Menu>
        </div>
    );
};

export const CollapsibleProductList = ({ products, label, isOrder = true }) => {
    const [showAll, setShowAll] = useState(false);
    const theme = useTheme();

    const initialDisplayCount = 3;
    const hasMoreProducts = products.length > initialDisplayCount;

    const displayedProducts = showAll ? products : products.slice(0, initialDisplayCount);

    const toggleShowAll = () => {
        setShowAll(prev => !prev);
    };

    const containerVariants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24
            }
        },
        exit: {
            opacity: 0,
            y: -10,
            transition: {
                duration: 0.2
            }
        }
    };

    return (
        <Box>
            <DrawerTypography theme={theme}>
                {label} {isOrder ? '+ (Quantity)' : ''}
            </DrawerTypography>

            {products && products.length > 0 ? (
                <>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {displayedProducts.map((item, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                layout
                            >
                                <Box sx={chipSx} className="mb-1">
                                    <Chip
                                        label={
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Box
                                                    onClick={() => window.open(`/${item.product.slug}`, '_blank')}
                                                    display="flex"
                                                    alignItems="center"
                                                    gap={1}
                                                    sx={{ cursor: 'pointer' }}
                                                >
                                                    <img
                                                        src={getImageUrl(item.product?.image)}
                                                        alt={item.product.name}
                                                        className="w-10 h-10 object-contain"
                                                    />
                                                    <Typography
                                                        variant="body2"
                                                        style={{ color: theme.palette.text.primary }}
                                                        className="!font-semibold hover:underline"
                                                    >
                                                        {`${item.product.name} ${isOrder ? `+ (${item.quantity})` : ''}`}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        }
                                        variant="outlined"
                                        className="w-full !justify-start"
                                    />
                                </Box>
                            </motion.div>
                        ))}
                    </motion.div>

                    {hasMoreProducts && (
                        <motion.div
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <OutlinedBrownButton
                                onClick={toggleShowAll}
                                variant="text"
                                size="small"
                                fullWidth
                                startIcon={
                                    <motion.div
                                        animate={{ rotate: showAll ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <ExpandMore />
                                    </motion.div>
                                }
                                className='mt-2'
                            >
                                {showAll ? `Show Less` : `Show ${products.length - initialDisplayCount} More`}
                            </OutlinedBrownButton>
                        </motion.div>
                    )}
                </>
            ) : (
                <Typography variant="body2" component="li" style={{ color: theme.palette.text.primary }}>
                    No products found
                </Typography>
            )}
        </Box>
    );
};

export const AuthActions = ({
    auth,
    isDropdownOpen,
    setIsProfileDropdownOpen,
    handleLogout,
    isAdmin,
    isOrderManager,
    isContentManager,
    isProductManager,
}) => {
    const handleClickAway = () => {
        if (isDropdownOpen) {
            setIsProfileDropdownOpen(false);
        }
    };

    return (
        <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
                {auth ? (
                    <ClickAwayListener onClickAway={handleClickAway}>
                        <div className="relative ml-4">
                            <ProfileIcon
                                handleProfileDropdownToggle={() => {
                                    setIsProfileDropdownOpen((prev) => !prev);
                                }}
                                isDropdownOpen={isDropdownOpen}
                                auth={auth}
                            />
                            {isDropdownOpen && (
                                <ProfileDropdown
                                    isOpen={isDropdownOpen}
                                    isAdmin={isAdmin}
                                    isOrderManager={isOrderManager}
                                    isContentManager={isContentManager}
                                    isProductManager={isProductManager}
                                    handleLogout={handleLogout}
                                />
                            )}
                        </div>
                    </ClickAwayListener>
                ) : (
                    <LoginButton />
                )}
            </div>
        </div>
    );
};

export const DashboardSearchInput = ({ openModal }) => {
    const theme = useTheme();

    return (
        <Box className="relative px-4 my-3">
            <Box onClick={openModal} tabIndex={0} role="button" className="relative">
                <InputBase
                    fullWidth
                    readOnly
                    disableUnderline
                    inputProps={{ className: "cursor-pointer focus:outline-none" }}
                    sx={{ borderColor: theme.palette.border.default }}
                    className="border rounded-md px-1 py-1.5 cursor-pointer focus:outline-none"
                />
                <Box className="absolute top-0 left-0 w-full h-full flex items-center pointer-events-none pl-3">
                    <Search className='mr-2' />
                    <Typography variant="body2" color="textSecondary" className='flex items-center'>
                        Search
                        <div className='ml-[6px]'>
                            <KeyboardKey theme={theme}>Ctrl</KeyboardKey>
                            <KeyboardKey theme={theme}>K</KeyboardKey>
                        </div>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export const DashboardSearchEmpty = () => {
    return (
        <Box className="flex items-center justify-center p-1 mt-4">
            <SearchOff className='mr-1 text-xl' />
            <Typography>No results found</Typography>
        </Box>
    );
};

export const DashboardSearchHintBar = ({ theme }) => {
    return (
        <Box sx={dashboardSearchHintBarSx(theme)} className="sticky top-0 z-10 pb-3 flex justify-between items-center border-b">
            <div className="flex items-center gap-0.5 text-sm">
                <KeyboardKey theme={theme} customStyle="py-[0.5px]">
                    <span className='text-base'>↑</span>
                </KeyboardKey>
                <KeyboardKey theme={theme} customStyle="py-[0.5px]">
                    <span className='text-base'>↓</span>
                </KeyboardKey>
                <span className='ml-0.5'>Navigate</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
                <KeyboardKey theme={theme}>
                    <KeyboardReturn fontSize="small" />
                </KeyboardKey>
                <span>Open</span>
            </div>
        </Box>
    );
};

export const DashboardSearchSuggestions = ({
    suggestionsRef,
    suggestions,
    selectedIndex,
    handleSuggestionClick,
}) => {
    const theme = useTheme();

    return (
        <div className="flex flex-col max-h-[500px]">
            <DashboardSearchHintBar theme={theme} />
            <Box
                ref={suggestionsRef}
                sx={dashboardSearchSuggestionsBoxSx(theme)}
            >
                {suggestions.map((item, index) => (
                    <Box
                        key={item.id}
                        onClick={() => handleSuggestionClick(item)}
                        tabIndex={0}
                        role="button"
                        sx={dashboardSearchSuggestionsSx(index, selectedIndex, theme)}
                        className="p-3 cursor-pointer flex items-center gap-4"
                    >
                        {item.icon?.inactive && (
                            <span className="w-5 h-5 flex items-center justify-center">
                                <item.icon.inactive className="w-full h-full" />
                            </span>
                        )}
                        <p className="flex items-center">{item.label}</p>

                        <span
                            sx={dashboardSearchLabelSx(theme)}
                            className={`ml-auto mr-2 text-xs py-0.5 px-2 rounded-md ${theme.palette.mode === 'dark'
                                ? 'bg-stone-600 text-white'
                                : 'bg-stone-200 text-gray-700'
                                }`}
                        >
                            Entity
                        </span>
                    </Box>
                ))}
            </Box>
        </div>
    );
};

export const DashboardSearchModal = ({
    isModalOpen,
    handleClose,
    handleKeyDown,
    searchTerm,
    setSearchTerm,
    modalInputRef,
    suggestions,
    selectedIndex,
    handleSuggestionClick,
    suggestionsRef,
}) => {
    const theme = useTheme();
    const hasSearched = searchTerm.trim().length > 0;

    const handleCloseClick = () => {
        setSearchTerm('');
        modalInputRef.current.focus();
    };

    const InputProps = {
        startAdornment: (
            <InputAdornment position="start">
                <Search />
            </InputAdornment>
        ),
        endAdornment: searchTerm && (
            <InputAdornment position="end">
                <IconButton size="small" onClick={handleCloseClick}>
                    <Close fontSize="small" />
                </IconButton>
            </InputAdornment>
        ),
    };

    return (
        <Modal
            open={isModalOpen}
            onClose={handleClose}
            className="flex items-start justify-center bg-[rgba(0,0,0,0.3)] backdrop-blur-sm"
        >
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="w-full max-w-[600px] mt-48"
                    >
                        <Box sx={dashboardSearchBoxSx(theme)} className="w-full rounded-md shadow-lg p-4 max-h-[80vh] overflow-y-auto">
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Search dashboard..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleKeyDown}
                                inputRef={modalInputRef}
                                autoFocus
                                InputProps={InputProps}
                                sx={dashboardSearchTextSx(theme, suggestions.length > 0)}
                            />

                            {suggestions.length > 0 ? (
                                <DashboardSearchSuggestions
                                    suggestions={suggestions}
                                    selectedIndex={selectedIndex}
                                    handleSuggestionClick={handleSuggestionClick}
                                    suggestionsRef={suggestionsRef}
                                />
                            ) : hasSearched ? (
                                <DashboardSearchEmpty />
                            ) : null}
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>
        </Modal>
    );
};

export const DashboardSearchBar = ({ onMenuItemClick, getAllMenuItems }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const location = useLocation();
    const suggestionsRef = useRef(null);
    const modalInputRef = useRef(null);

    const isNavigable = () => isModalOpen && showSuggestions && suggestions.length > 0;
    const isSelectable = () => isNavigable() && selectedIndex >= 0;

    const navigateSuggestions = (direction) =>
        setSelectedIndex((prev) => {
            const next = Math.max(0, Math.min(prev + direction, suggestions.length - 1));
            scrollToSuggestion(next);
            return next;
        });

    const handleClose = () => {
        setIsModalOpen(false);
        setSearchTerm('');
        setShowSuggestions(false);
        setSelectedIndex(-1);
    };

    const hotkeysConfig = [
        { keys: 'ctrl+k', action: (e) => (e.preventDefault(), openModal()) },
        { keys: 'down', action: (e) => isNavigable() && navigateSuggestions(1) },
        { keys: 'up', action: (e) => isNavigable() && navigateSuggestions(-1) },
        { keys: 'enter', action: (e) => isSelectable() && handleSuggestionClick(suggestions[selectedIndex]) },
        { keys: 'esc', action: handleClose },
    ];

    hotkeysConfig.forEach(({ keys, action }) =>
        useHotkeys(keys, (e) => (e.preventDefault(), action(e)), { enableOnFormTags: true },
            [isModalOpen, showSuggestions, suggestions, selectedIndex])
    );

    useEffect(() => {
        if (isModalOpen && modalInputRef.current) modalInputRef.current.focus();
    }, [isModalOpen]);

    useEffect(() => {
        const allItems = getAllMenuItems();
        if (!searchTerm) return setSuggestions([]);

        const searchLower = searchTerm.toLowerCase();
        setSuggestions(allItems.filter(item =>
            item.id.toLowerCase().includes(searchLower) ||
            item.label.toLowerCase().includes(searchLower)
        ));
        setSelectedIndex(-1);
    }, [searchTerm, getAllMenuItems]);

    useEffect(() => {
        setSearchTerm('');
        setShowSuggestions(false);
        setSelectedIndex(-1);
        setIsModalOpen(false);
    }, [location]);

    const openModal = () => {
        setIsModalOpen(true);
        setShowSuggestions(true);
        setTimeout(() => modalInputRef.current?.focus(), 0);
    };

    const handleSuggestionClick = (item) => {
        onMenuItemClick(item.id);
        handleClose();
    };

    const scrollToSuggestion = (index) => {
        const child = suggestionsRef.current?.children[index];
        if (child) child.scrollIntoView({ block: 'nearest' });
    };

    return (
        <>
            <DashboardSearchInput openModal={openModal} />

            <DashboardSearchModal
                isModalOpen={isModalOpen}
                handleClose={handleClose}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                modalInputRef={modalInputRef}
                suggestions={suggestions}
                selectedIndex={selectedIndex}
                handleSuggestionClick={handleSuggestionClick}
                suggestionsRef={suggestionsRef}
            />
        </>
    );
};

export const ImageUploadBox = ({ onFileSelect, initialPreview }) => {
    const [imagePreview, setImagePreview] = useState(initialPreview || null);
    const [isDragging, setIsDragging] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        setImagePreview(initialPreview || null);
    }, [initialPreview]);

    const handleFile = useCallback((file) => {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (validTypes.includes(file.type)) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            onFileSelect(file);
        } else {
            toast.error('Invalid file type. Please upload an image (jpeg, jpg or png)');
            console.error('Invalid file type. Please upload an image (jpeg, jpg or png)');
        }
    }, [onFileSelect]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) handleFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    return (
        <Box
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input').click()}
            className={`border-2 border-dashed ${isDragging ? 'border-stone-500' : 'border-stone-200'} rounded-md mb-4 p-6 cursor-pointer flex flex-col items-center justify-center gap-2`}
        >
            {imagePreview ? (
                <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full h-auto mx-auto rounded-md"
                />
            ) : (
                <>
                    <UploadFile sx={{ fontSize: 45 }} className={`text-${theme.palette.mode === 'dark' ? 'white' : isDragging ? 'stone-700' : 'stone-600'}`} />
                    <CustomTypography variant="body1" className={`text-${theme.palette.mode === 'dark' ? 'white' : isDragging ? 'brown-500' : 'brown-200'}`}>
                        Drag and drop an image here or click to select
                    </CustomTypography>
                </>
            )}
            <VisuallyHiddenInput id="file-input" type="file" onChange={handleImageChange} />
        </Box>
    );
};

export const getFlagURL = (countryCode) => `https://flagcdn.com/w80/${countryCode.toLowerCase()}.png`;

export const DashboardCountryFlag = ({ countryCode, name }) => {
    const handleImageClick = () => {
        const searchURL = `https://www.google.com/search?q=${name}+${countryCode}`;
        window.open(searchURL, '_blank');
    };

    return (
        <div className='flex items-center'>
            <Tooltip title={`Click to search '${name} ${countryCode}' in Google`} placement='left' arrow>
                <img
                    src={getFlagURL(countryCode)}
                    alt={`${name} flag`}
                    onClick={handleImageClick}
                    onError={(e) => (e.target.style.display = 'none')}
                    className="w-9 h-6 mr-2 inline cursor-pointer"
                />
            </Tooltip>
            {name}
        </div>
    );
};

export const DashboardImage = ({ item, handleImageClick }) => {
    return (
        <Tooltip title='Click to preview' placement='left' arrow>
            <img
                src={getImageUrl(item.image)}
                alt={item.name}
                width={70}
                style={{ position: 'relative', top: '3px' }}
                onClick={() => handleImageClick(getImageUrl(item.image))}
                className='rounded-md cursor-pointer'
            />
        </Tooltip>
    )
};

export const DashboardAppBar = ({ open, children }) => {
    const { theme } = useDashboardTheme();

    return (
        <AppBar
            position="absolute"
            open={open}
            sx={dashboardAppBarSx(theme)}
        >
            {children}
        </AppBar>
    );
};

export const DashboardToolbar = ({ children }) => {
    const { theme } = useDashboardTheme();

    return (
        <Toolbar sx={dashboardToolBarSx(theme)} >
            {children}
        </Toolbar>
    );
};

const ToggleDarkMode = ({ toggleTheme, mode, theme }) => {
    return (
        <IconButton onClick={toggleTheme} color="inherit" >
            {mode === 'dark' ? <LightMode /> : <DarkMode className='text-stone-500' />}
        </IconButton>
    );
};

export const DashboardNavbar = ({
    open,
    toggleDrawer,
    auth,
    handleProfileDropdownToggle,
    handleLogout,
    isAdmin,
    isOrderManager,
    isContentManager,
    isProductManager,
}) => {
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const { toggleTheme, mode } = useDashboardTheme();
    const theme = useTheme();

    return (
        <DashboardAppBar open={open}>
            <DashboardToolbar>
                <ExtendIcon toggleDrawer={toggleDrawer} open={open} />

                <div className="flex justify-between items-center top-0 left-0 right-0 z-50 mx-auto-xl px-12 w-full">
                    <div className="flex items-center mb-5">
                        <NavbarLogo dashboardStyling={'relative top-2 w-24 h-11 md:w-full md:h-full'} />
                    </div>
                    <div className="flex items-center gap-4">
                        <AuthActions
                            auth={auth}
                            isDropdownOpen={isProfileDropdownOpen}
                            setIsProfileDropdownOpen={setIsProfileDropdownOpen}
                            handleProfileDropdownToggle={handleProfileDropdownToggle}
                            handleLogout={handleLogout}
                            isAdmin={isAdmin}
                            isOrderManager={isOrderManager}
                            isContentManager={isContentManager}
                            isProductManager={isProductManager}
                        />

                        <ToggleDarkMode toggleTheme={toggleTheme} mode={mode} theme={theme} />
                    </div>
                </div>
            </DashboardToolbar>
        </DashboardAppBar>
    );
};

export const RenderOrderPaymentInfo = (order) => {
    const { paymentMethod, paymentStatus } = order;

    return (
        <div className="flex items-center">
            <span>
                {paymentMethod} - {paymentStatus}
            </span>
        </div>
    );
};