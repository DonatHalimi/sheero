import { LocalAtm, Payment } from '@mui/icons-material';
import React, { useState } from 'react';
import { CustomModal, LoadingOverlay } from '../../assets/CustomComponents';

const PaymentModal = ({ open, onClose, onStripePayment, onCashPayment }) => {
    const [loading, setLoading] = useState(false);

    const handleStripePayment = () => {
        setLoading(true);  // Show loading overlay
        onClose();         // Close the modal
        onStripePayment();  // Trigger Stripe payment process
    };

    const handleCashPayment = () => {
        setLoading(true);  // Show loading overlay
        onClose();         // Close the modal
        onCashPayment();    // Trigger cash payment process
    };

    return (
        <>
            <CustomModal open={open} onClose={onClose}>
                <div className="flex justify-between p-4 space-x-4">
                    {/* Pay with Stripe option */}
                    <div
                        className="w-1/2 border-2 rounded-md p-3 cursor-pointer hover:border-blue-500 transition-all flex flex-col justify-between"
                        onClick={handleStripePayment}
                        title="Stripe Payment"
                    >
                        <div className="flex flex-col items-center mb-2">
                            <Payment fontSize="large" className="text-blue-500" />
                            <h2 className="text-center text-lg font-semibold mt-2">Pay with Stripe</h2>
                        </div>
                        <p className="text-center text-sm text-gray-500">
                            Use your credit or debit card via Stripe.
                        </p>
                        <div className="mt-2 p-1 bg-blue-50 text-blue-600 text-center rounded text-sm">
                            Secure online payment with Stripe
                        </div>
                    </div>

                    {/* Pay with Cash option */}
                    <div
                        className="w-1/2 border-2 rounded-md p-3 cursor-pointer hover:border-green-500 transition-all flex flex-col justify-between"
                        onClick={handleCashPayment}
                        title="Cash on Delivery"
                    >
                        <div className="flex flex-col items-center mb-2">
                            <LocalAtm fontSize="large" className="text-green-500" />
                            <h2 className="text-center text-lg font-semibold mt-2">Pay with Cash</h2>
                        </div>
                        <p className="text-center text-sm text-gray-500">
                            Pay with cash upon delivery.
                        </p>
                        <div className="mt-2 p-1 bg-green-50 text-green-600 text-center rounded text-sm">
                            Pay when you receive your order
                        </div>
                    </div>
                </div>
            </CustomModal>

            {loading && <LoadingOverlay />}
        </>
    );
};

export default PaymentModal;
