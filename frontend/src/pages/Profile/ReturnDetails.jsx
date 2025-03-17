import { LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EmptyState, formatDate, Header, LoadingOrderDetails, ProfileLayout } from '../../assets/CustomComponents';
import { generateReturnPDF } from '../../assets/DataExport';
import emptyReturnsImage from '../../assets/img/empty/orders.png';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Utils/Footer';
import { getReturnDetailsService } from '../../services/returnService';
import { getImageUrl } from '../../utils/config';

const ReturnDetails = () => {
    const { returnId } = useParams();

    const [returnRequest, setReturnRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const isReturnProcessed = returnRequest && returnRequest.status === 'processed';

    const fetchReturnDetails = async () => {
        try {
            const response = await getReturnDetailsService(returnId);
            setReturnRequest(response.data.data);
        } catch (error) {
            console.error('Error fetching return details:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (returnId) {
            fetchReturnDetails();
        }
    }, [returnId]);

    const displayReason = returnRequest
        ? (returnRequest.reason === 'Other'
            ? returnRequest.customReason
            : returnRequest.reason)
        : '';

    const getStatusProgress = (status) => {
        switch (status) {
            case 'pending': return 16;
            case 'approved': return 57;
            case 'processed': return 100;
            case 'rejected': return 0;
            default: return 0;
        }
    };

    const handleDownloadReturn = () => {
        if (returnRequest) {
            generateReturnPDF(returnRequest);
        }
    };

    return (
        <>
            <Navbar />
            <ProfileLayout>
                <Header
                    title="Return Request:"
                    returnId={returnId}
                    isReturnDetails={isReturnProcessed}
                    onDownloadReturn={handleDownloadReturn}
                />

                {loading ? (
                    <LoadingOrderDetails isOrder={false} />
                ) : returnRequest ? (
                    <>
                        {/* Return Status Card */}
                        <div className="grid grid-cols-1 gap-4 mb-4">
                            <div className="bg-white shadow rounded-md p-6">
                                <p className="font-semibold text-center text-lg mb-1">
                                    Return Request Status
                                </p>
                                <p className="font-semilight mb-3 text-center text-gray-500 text-md">
                                    Return Request Date: {formatDate(returnRequest.createdAt)}
                                </p>
                                <LinearProgress
                                    variant="determinate"
                                    value={getStatusProgress(returnRequest.status)}
                                    sx={{ height: 20, width: { xs: '80%', sm: '70%', md: '60%' }, margin: 'auto', borderRadius: 1 }}
                                />
                                <div className="flex justify-between mt-4" style={{ width: '60%', margin: 'auto', marginTop: '4px' }}>
                                    {returnRequest.status === 'rejected' ? (
                                        <span className="text-center font-semibold bg-stone-100 rounded-md px-1">Rejected</span>
                                    ) : (
                                        <>
                                            <span className={`text-center ${returnRequest.status === 'pending' ? 'font-semibold bg-stone-100 rounded-md px-1' : ''}`}>Pending</span>
                                            <span className={`text-center ${returnRequest.status === 'approved' ? 'font-semibold bg-stone-100 rounded-md px-1' : ''}`}>Approved</span>
                                            <span className={`text-center ${returnRequest.status === 'processed' ? 'font-semibold bg-stone-100 rounded-md px-1' : ''}`}>Processed</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="grid grid-cols-1 gap-4 mb-4">
                            <div className="bg-white shadow rounded-md p-6">
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Product</TableCell>
                                                <TableCell align="right">Reason</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {returnRequest.products.map(({ _id, name, slug, image }) => (
                                                <TableRow key={_id}>
                                                    <TableCell component="th" scope="row" className='w-10/12'>
                                                        <Link to={`/${slug}`} className="flex items-center">
                                                            <img
                                                                src={getImageUrl(image)}
                                                                alt={name}
                                                                className="w-16 h-16 object-contain rounded mr-2"
                                                            />
                                                            <div className='hover:underline'>{name}</div>
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {displayReason}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </div>
                    </>
                ) : (
                    <EmptyState
                        imageSrc={emptyReturnsImage}
                        context='returns'
                    />
                )}
            </ProfileLayout>

            <Footer />
        </>
    );
};

export default ReturnDetails;