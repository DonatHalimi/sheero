import React from 'react';
import { Link } from 'react-router-dom';

const OrderItem = ({ order, renderProductImages, getStatusColor }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <Link to={`/profile/orders/${order._id}`}>
                <div className="flex justify-between text-sm capitalize mb-4">
                    <div className="flex items-center">
                        <p>#{order._id}</p>
                        <span className="mx-1">&#x2022;</span>
                        <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                        <span className="mx-1">&#x2022;</span>
                        <p className={getStatusColor(order.status)}>{order.status}</p>
                    </div>
                    <p className="font-semibold">€{order.totalAmount.toFixed(2)}</p>
                </div>

                <div className="border-t border-stone-100" />

                <div className="mt-4">
                    <div className="flex space-x-2">
                        {renderProductImages(order.products)}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default OrderItem;