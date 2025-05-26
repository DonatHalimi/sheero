import {
    Apartment,
    CalendarMonth,
    Cancel,
    CheckCircle,
    CreditCard,
    Description,
    ErrorOutline,
    EuroSymbol,
    Forum,
    HourglassBottom,
    HourglassTop,
    InventoryOutlined,
    Language,
    LocalAtm,
    LocalShipping,
    LocationOn,
    Person,
    PhoneInTalk,
    Tag
} from "@mui/icons-material";
import { InputAdornment, useTheme } from "@mui/material";

/**
 * @file InputAdornments.jsx
 * @description A collection of reusable input adornment components for each dashboard page details drawer.
 *
 * This file provides a set of custom-built input adornments that are used to display icons next to input fields in each dashboard's page details drawer.
 */

export const IdAdornment = () => {
    return {
        startAdornment: (
            <InputAdornment position="start">
                <Tag fontSize="10px" />
            </InputAdornment>
        ),
    };
};

export const EuroAdornment = () => {
    return {
        startAdornment: (
            <InputAdornment position="start">
                <EuroSymbol fontSize="10px" />
            </InputAdornment>
        ),
    };
};

export const DateAdornment = () => {
    return {
        startAdornment: (
            <InputAdornment position="start">
                <CalendarMonth fontSize="10px" />
            </InputAdornment>
        ),
    };
};

export const DescriptionAdornment = () => {
    return {
        startAdornment: (
            <InputAdornment position="start">
                <Description fontSize="10px" />
            </InputAdornment>
        ),
    };
};

export const PersonAdornment = () => {
    return {
        startAdornment: (
            <InputAdornment position="start">
                <Person fontSize="10px" />
            </InputAdornment>
        ),
    };
};

export const InventoryAdornment = () => {
    return {
        startAdornment: (
            <InputAdornment position="start">
                <InventoryOutlined fontSize="10px" />
            </InputAdornment>
        ),
    };
};

export const ShippingAdornment = () => {
    return {
        startAdornment: (
            <InputAdornment position="start">
                <LocalShipping fontSize="10px" />
            </InputAdornment>
        ),
    };
};

export const PhoneAdornment = () => {
    return {
        startAdornment: (
            <InputAdornment position="start">
                <PhoneInTalk fontSize="10px" />
            </InputAdornment>
        ),
    };
};

export const StreetAdornment = () => {
    return {
        startAdornment: (
            <InputAdornment position="start">
                <LocationOn fontSize="10px" />
            </InputAdornment>
        ),
    };
};

export const CountryAdornment = () => {
    return {
        startAdornment: (
            <InputAdornment position="start">
                <Language fontSize="10px" />
            </InputAdornment>
        ),
    };
};

export const CityAdornment = () => {
    return {
        startAdornment: (
            <InputAdornment position="start">
                <Apartment fontSize="10px" />
            </InputAdornment>
        ),
    };
};

export const CommentAdornment = () => {
    return {
        startAdornment: (
            <InputAdornment position="start">
                <Forum fontSize="10px" />
            </InputAdornment>
        ),
    };
};

export const PaymentStatusAdornment = (status) => {
    let icon;
    switch (status) {
        case 'completed':
            icon = <CheckCircle fontSize="10px" />;
            break;
        case 'failed':
            icon = <ErrorOutline fontSize="10px" />;
            break;
        default:
            icon = <HourglassTop fontSize="10px" />;
    }
    return {
        startAdornment: <InputAdornment position="start">{icon}</InputAdornment>,
    };
};

export const PaymentMethodAdornment = (method) => {
    let icon;
    switch (method) {
        case 'cash':
            icon = <LocalAtm fontSize="10px" />;
            break;
        default:
            icon = <CreditCard fontSize="10px" />;
    }
    return {
        startAdornment: <InputAdornment position="start">{icon}</InputAdornment>,
    };
};

export const DeliveryStatusAdornment = (status) => {
    let icon;
    switch (status) {
        case 'processed':
            icon = <HourglassBottom fontSize="10px" />;
            break;
        case 'shipped':
            icon = <LocalShipping fontSize="10px" />;
            break;
        case 'delivered':
            icon = <CheckCircle fontSize="10px" />;
            break;
        case 'canceled':
            icon = <Cancel fontSize="10px" />;
            break;
        default:
            icon = <HourglassTop fontSize="10px" />;
    }
    return {
        startAdornment: <InputAdornment position="start">{icon}</InputAdornment>,
    };
};

export const ReturnStatusAdornment = (status) => {
    let icon;
    switch (status) {
        case 'approved':
            icon = <HourglassBottom fontSize="10px" />;
            break;
        case 'processed':
            icon = <CheckCircle fontSize="10px" />;
            break;
        case 'rejected':
            icon = <Cancel fontSize="10px" />;
            break;
        default:
            icon = <HourglassTop fontSize="10px" />;
    }
    return {
        startAdornment: <InputAdornment position="start">{icon}</InputAdornment>,
    };
};

export const RenderStatus = ({ status, type }) => {
    const statusClassesMap = {
        delivery: {
            pending: 'text-yellow-500',
            processed: 'text-cyan-500',
            shipped: 'text-blue-700',
            delivered: 'text-green-500',
            canceled: 'text-red-500',
        },
        return: {
            pending: 'text-yellow-500',
            approved: 'text-blue-500',
            rejected: 'text-red-500',
            processed: 'text-green-500',
        }
    };

    const adornmentMap = {
        delivery: DeliveryStatusAdornment,
        return: ReturnStatusAdornment
    };

    const theme = useTheme();
    const statusMap = statusClassesMap[type] || {};
    const color = statusMap[status] || 'text-gray-500';
    const adornment = adornmentMap[type]?.(status) || {};

    return (
        <div className="flex items-center mt-6">
            {adornment.startAdornment}
            <span
                style={{ backgroundColor: theme.palette.mode === 'dark' ? '#2f2f2f' : '#f5f5f4' }}
                className={`${color} capitalize bg-stone-50 dark:bg-neutral-800 rounded-md px-2 py-0.5 text-[14px] leading-none`}
            >
                {status}
            </span>
        </div>
    );
};

export const RenderOrderDelStatus = ({ order }) => {
    return (
        <RenderStatus status={order.status} type="delivery" />
    );
};

export const RenderReturnStatus = ({ returnRequest }) => {
    return (
        <RenderStatus status={returnRequest.status} type="return" />
    );
};