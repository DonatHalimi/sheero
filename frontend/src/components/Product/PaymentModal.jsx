import { LocalAtm, Payment } from '@mui/icons-material';
import React, { useState } from 'react';
import { CustomModal, LoadingOverlay } from '../../assets/CustomComponents';

const PaymentModal = ({ open, onClose, onStripePayment, onCashPayment }) => {
    const [loading, setLoading] = useState(false);

    const handlePayment = (paymentMethod) => {
        setLoading(true);
        onClose();
        paymentMethod();
    };

    return (
        <>
            <CustomModal open={open} onClose={onClose}>
                <div className="flex flex-col sm:flex-row justify-between gap-6 p-3">
                    <div
                        className="w-full sm:w-3/4 border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-all flex flex-col items-center text-center shadow-sm"
                        onClick={() => handlePayment(onStripePayment)}
                    >
                        <Payment fontSize="large" className="text-blue-500 mb-3" />
                        <h2 className="text-lg font-semibold mb-1">Pay with Stripe</h2>
                        <p className="text-gray-600 mb-3">Use your card via Stripe.</p>
                        <span className="text-blue-600 bg-blue-100 py-1 px-2 rounded text-sm">Secure online payment</span>
                    </div>

                    <div
                        className="w-full sm:w-3/4 border rounded-lg p-4 cursor-pointer hover:border-green-500 transition-all flex flex-col items-center text-center shadow-sm"
                        onClick={() => handlePayment(onCashPayment)}
                    >
                        <LocalAtm fontSize="large" className="text-green-500 mb-3" />
                        <h2 className="text-lg font-semibold mb-1">Cash on Delivery</h2>
                        <p className="text-gray-600 mb-3">Pay with cash upon delivery.</p>
                        <span className="text-green-600 bg-green-100 py-1 px-2 rounded text-sm">Pay upon order receipt</span>
                    </div>
                </div>

            </CustomModal>

            {loading && <LoadingOverlay />}
        </>
    );
};

export default PaymentModal;