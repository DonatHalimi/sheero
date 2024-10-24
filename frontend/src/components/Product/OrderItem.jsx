import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, formatPrice } from '../../assets/CustomComponents';

const OrderItem = ({ order, renderProductImages, getStatusColor }) => {
    const { _id: id, createdAt, status, totalAmount, products } = order;
    const symbol = '•';

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <Link to={`/profile/orders/${id}`}>
                <div className="flex justify-between text-sm capitalize mb-4">
                    <div className="flex items-center">
                        <p>#{id}</p>
                        <span className="mx-1">{symbol}</span>
                        <p>{formatDate(createdAt)}</p>
                        <span className="mx-1">{symbol}</span>
                        <p className={getStatusColor(status)}>{status}</p>
                    </div>
                    <p className="font-semibold">€ {formatPrice(totalAmount)}</p>
                </div>

                <div className="border-t border-stone-100" />

                <div className="mt-4 flex space-x-2">
                    {renderProductImages(products)}
                </div>
            </Link>
        </div>
    );
};

export default OrderItem;