import { Link } from 'react-router-dom';
import { formatDate, formatPrice } from '../../../components/custom/utils';
import { getImageUrl } from '../../../utils/config/config';

const OrderItem = ({ order, getStatusColor }) => {
    const { _id: id, createdAt, status, totalAmount, products } = order;
    const symbol = '•';

    const date = formatDate(createdAt);
    const price = formatPrice(totalAmount);

    return (
        <Link to={`/profile/orders/${id}`}>
            <div className="bg-white shadow rounded-md p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex justify-between text-sm mb-4">
                    <div className="flex items-center">
                        <p>#{id}</p>
                        <span className="mx-1">{symbol}</span>
                        <p>{date}</p>
                        <span className="mx-1">{symbol}</span>
                        <p className={getStatusColor(status)}>{status}</p>
                    </div>
                    <p className="font-semibold">€ {price}</p>
                </div>

                <div className="border-t border-stone-100" />

                <div className="mt-4 flex space-x-2">
                    {Array.isArray(products) && products.map(({ product }) => {
                        if (!product) return null;
                        const { _id, image, name, slug } = product;
                        if (!_id || !image || !name || !slug) return null;

                        return (
                            <Link key={_id} to={`/${slug}`}>
                                <img
                                    src={getImageUrl(image)}
                                    alt={name}
                                    className="w-20 h-20 object-contain rounded cursor-pointer"
                                />
                            </Link>
                        );
                    })}
                </div>
            </div>
        </Link>
    );
};

export default OrderItem;