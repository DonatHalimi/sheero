import { Box, Breadcrumbs, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, useTheme } from "@mui/material";
import { Link, Link as RouterLink } from "react-router-dom";
import { loadingDataGridContainerSx, loadingDataGridSkeletonSx, profileBoxSx, slideShowSkeletonSx } from "../../assets/sx";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Utils/Footer";
import { HomeBreadCrumbIcon } from "./Icons";

/**
 * @file LoadingSkeletons.jsx
 * @description A collection of reusable loading skeleton components for the application.
 *
 * This file provides a set of custom-built loading skeleton components that can be used to 
 * display a loading state in various parts of the application designed to mimic the actual content.
 */

export const WaveSkeleton = (props) => <Skeleton animation="wave" {...props} />;

export const LoadingProductDetails = () => {
    return (
        <>
            <div className='container mx-auto px-4 max-w-5xl relative top-6 right-4'>
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4, fontSize: '14px' }}>
                    <Link component={RouterLink} to="/" color="inherit" underline="none">
                        <HomeBreadCrumbIcon className="text-stone-500 hover:text-stone-700" />
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

        <WaveSkeleton variant="circular" width={50} height={50} sx={{ ...slideShowSkeletonSx, left: '20px' }} />

        <WaveSkeleton variant="circular" width={50} height={50} sx={{ ...slideShowSkeletonSx, right: '20px', left: 'auto' }} />
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

export const LoadingRestock = () => (
    <Box sx={{ p: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }} >
        <WaveSkeleton variant="rectangular" width={400} height={47} className='rounded' />
        <WaveSkeleton variant="rectangular" width="100%" height={40} className='rounded' />
    </Box>
);

export const LoadingCart = () => {
    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 lg:px-24 py-2 mb-16 bg-gray-50 mt-10">
                {/* Mobile-only header */}
                <div className="bg-white p-4 rounded-md shadow mb-3 flex justify-between items-center px-2 md:hidden mt-[72px]">
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
                            <TableContainer className="bg-white rounded-lg shadow">
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
                                    <TableBody className="[&>tr:last-child>td]:border-b-0 [&>tr:last-child>th]:border-b-0">
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
                        <div className="lg:hidden space-y-4 shadow">
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
                        <div className="bg-white p-4 rounded-lg shadow">
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
            <div key={index} className="relative p-4 mb-4 bg-white rounded-md shadow-sm h-[142px]">
                <div className="absolute top-4 right-4">
                    <WaveSkeleton variant="circular" width={24} height={24} />
                </div>

                <div className="flex flex-grow">
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
                    <Box key={index} className="bg-white shadow-md rounded-lg p-6 relative h-[181px]">
                        <Box className="flex justify-between items-center mb-4">
                            <WaveSkeleton variant="text" width="40%" />
                            <Box>
                                <WaveSkeleton variant="text" width={100} />
                            </Box>
                        </Box>
                        <div className="flex space-x-3 mt-6 mb-2">
                            <WaveSkeleton variant="rectangular" height={60} width={60} className='rounded' />
                            <WaveSkeleton variant="rectangular" height={60} width={60} className='rounded' />
                            <WaveSkeleton variant="rectangular" height={60} width={60} className='rounded' />
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
                    <WaveSkeleton variant="text" width="20%" height={30} />
                    <WaveSkeleton variant="text" width="40%" height={20} />
                </div>
                <div className='flex flex-col items-center'>
                    <WaveSkeleton variant="text" width="50%" height={40} />
                </div>
                <Box className={`flex justify-center ${isOrder ? "gap-7" : "gap-20"}`}>
                    {Array.from({ length: isOrder ? 4 : 3 }).map((_, index) => (
                        <WaveSkeleton key={index} variant="text" width="10%" height={20} />
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

export const LoadingDataGrid = () => {
    const theme = useTheme();
    const rows = Array(10).fill(null);
    const columns = Array(6).fill({ width: [280, 220, 280, 220, 280, 110] });

    return (
        <>
            {/* Actions Header */}
            <div style={loadingDataGridContainerSx(theme)} className="p-4 flex items-center justify-between w-full mt-2 mb-4 rounded-md">
                <div className="flex items-center gap-3">
                    <WaveSkeleton
                        variant="rectangular"
                        width={90}
                        height={25}
                        sx={loadingDataGridSkeletonSx(theme)}
                        className="rounded-md"
                    />

                    <WaveSkeleton
                        variant="circular"
                        width={25}
                        height={25}
                        sx={loadingDataGridSkeletonSx(theme)}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <WaveSkeleton
                        variant="rectangular"
                        width={70}
                        height={25}
                        sx={loadingDataGridSkeletonSx(theme)}
                        className="rounded-md"
                    />
                    <WaveSkeleton
                        variant="circular"
                        width={25}
                        height={25}
                        sx={loadingDataGridSkeletonSx(theme)}
                    />
                </div>
            </div>

            {/* Table Container */}
            <div style={loadingDataGridContainerSx(theme)} className="p-4 rounded-md">
                {/* Table Header */}
                <div className="flex justify-end items-center pb-4 border-b gap-3">
                    {[...Array(4)].map((_, i) => (
                        <WaveSkeleton
                            key={`header-${i}`}
                            variant="rectangular"
                            width={60}
                            height={25}
                            sx={loadingDataGridSkeletonSx(theme)}
                            className="rounded-md"
                        />
                    ))}
                </div>

                {/* Table Rows */}
                {rows.map((_, rowIdx) => (
                    <div key={rowIdx} className="flex gap-4 border-b py-3">
                        {columns[0].width.map((width, colIdx) => (
                            <WaveSkeleton
                                key={`row-${rowIdx}-col-${colIdx}`}
                                variant="rectangular"
                                width={width}
                                height={25}
                                sx={loadingDataGridSkeletonSx(theme)}
                                className="rounded-md"
                            />
                        ))}
                    </div>
                ))}

                {/* Footer */}
                <div className="flex justify-end items-center mt-1 pt-4 gap-3">
                    <WaveSkeleton
                        variant="rectangular"
                        width={150}
                        height={25}
                        sx={loadingDataGridSkeletonSx(theme)}
                        className="rounded"
                    />
                    <WaveSkeleton
                        variant="rectangular"
                        width={50}
                        height={25}
                        sx={loadingDataGridSkeletonSx(theme)}
                        className="rounded"
                    />
                    {[...Array(2)].map((_, i) => (
                        <WaveSkeleton
                            key={`footer-${i}`}
                            variant="circular"
                            width={25}
                            height={25}
                            sx={loadingDataGridSkeletonSx(theme)}
                            className="rounded"
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export const LoadingDetails = ({ showAdditionalField }) => {
    return (
        <Box className='space-y-0'>
            <Box sx={profileBoxSx}>
                <WaveSkeleton variant="text" width="100%" height={85} className='flex-1' />
                <WaveSkeleton variant="text" width="100%" height={85} className='flex-1' />
                <WaveSkeleton variant="text" width="100%" height={85} className='flex-1' />
            </Box>
            <Box sx={profileBoxSx} className='relative bottom-4'>
                <WaveSkeleton variant="text" width="100%" height={80} className='flex-1' />
                <WaveSkeleton variant="text" width="100%" height={80} className='flex-1' />
            </Box>
            {showAdditionalField && (
                <>
                    <div className='relative bottom-8'>
                        <WaveSkeleton variant="text" width="100%" height={80} className='rounded' />
                    </div>
                </>
            )}
            <div className='absolute bottom-[69px]'>
                <WaveSkeleton variant="text" width={120} height={60} className='rounded' />
            </div>
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
        <div className="spinner">
            <div />
            <div />
            <div />
            <div />
            <div />
        </div>
    </div>
);

export const LoadingSplide = ({ count }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(count)].map((_, index) => (
            <WaveSkeleton key={index} variant="rectangular" width="100%" height={60} className="rounded-md" />
        ))}
    </div>
);

export const LoadingLabel = ({ loading, defaultLabel = 'Add', loadingLabel = 'Adding' }) => (
    <>
        {loading ? (
            <>
                {loadingLabel}{' '}
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
            </>
        ) : (
            defaultLabel
        )}
    </>
);