import {
    CreateOutlined,
    DashboardOutlined,
    DeleteOutlined,
    ExpandLess,
    ExpandMore,
    FavoriteBorderOutlined,
    InboxOutlined,
    Logout,
    PersonOutlined,
    Settings,
    ShoppingCart,
    ShoppingCartOutlined,
    Star,
    StarBorder,
} from '@mui/icons-material';
import {
    Box,
    Button,
    Collapse,
    FormControl,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    AppBar as MuiAppBar, Drawer as MuiDrawer,
    Paper,
    Tab,
    TableCell,
    TextField
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SvgIcon from '@mui/material/SvgIcon';
import { GridToolbar } from '@mui/x-data-grid';

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