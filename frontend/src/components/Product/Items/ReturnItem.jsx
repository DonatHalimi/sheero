import { Link } from 'react-router-dom';
import { formatDate } from '../../../components/custom/utils';
import { getImageUrl } from '../../../utils/config/config';

const ReturnItem = ({ returnRequest, getStatusColor }) => {
    const { _id: id, createdAt, status, reason, customReason, products } = returnRequest;
    const symbol = '•';

    const displayReason = reason === 'Other' ? customReason : reason;

    return (
        <Link to={`/profile/returns/${id}`}>
            <div className="bg-white shadow rounded-md p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex justify-between text-sm mb-4">
                    <div className="flex items-center">
                        <p>#{id}</p>
                        <span className="mx-1">{symbol}</span>
                        <p>{formatDate(createdAt)}</p>
                        <span className="mx-1">{symbol}</span>
                        <p className={getStatusColor(status)}>{status}</p>
                    </div>
                    <p className="font-semibold">{displayReason}</p>
                </div>

                <div className="border-t border-stone-100" />

                <div className="mt-4 flex space-x-2">
                    {Array.isArray(products) && products.map((product, index) => (
                        <Link key={index} to={`/${product.slug}`}>
                            <img
                                src={getImageUrl(product.image)}
                                alt={product.name}
                                className="w-20 h-20 object-contain rounded cursor-pointer"
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </Link>
    );
};

export default ReturnItem;