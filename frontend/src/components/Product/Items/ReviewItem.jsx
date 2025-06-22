import { CenteredMoreVertIcon } from '../../../components/custom/Icons';
import { RatingStars } from '../../../components/custom/Product';
import { truncateText } from '../../../components/custom/utils';
import { getImageUrl } from '../../../utils/config';

const ReviewItem = ({ review, onImageClick, onMenuClick, onCardClick }) => {
    const handleProductClick = (event) => {
        event.stopPropagation();
        onImageClick(review.product.slug);
    };

    const date = new Date(review.updatedAt || review.createdAt).toLocaleDateString();

    return (
        <div onClick={() => onCardClick(review)} className="bg-white p-4 h-auto min-h-[120px] shadow flex relative cursor-pointer rounded-md hover:shadow-md transition-shadow duration-300 flex-col sm:flex-row">
            <div className="flex-shrink-0 mb-3 sm:mb-0 sm:mr-4 w-[90px] h-[90px] overflow-hidden">
                <img
                    src={getImageUrl(review.product.image)}
                    alt={review.product.name}
                    onClick={handleProductClick}
                    className="object-contain w-full h-full rounded-md cursor-pointer hover:underline"
                />
            </div>
            <div className="flex-grow flex flex-col justify-between items-start">
                <div>
                    <h6 onClick={handleProductClick} className="font-light mb-[2px] flex items-center hover:underline break-words text-lg">

                        <h5 className='font-semibold'>{truncateText(review.product.name, 45)}</h5>
                        <div className="ml-2">
                            <RatingStars rating={review.rating} />
                        </div>
                    </h6>
                    <p className="text-base font-semibold break-words">
                        {truncateText(review.title, 70)}
                    </p>
                    <div className="mt-1 text-gray-700 break-words">
                        <p className="break-words">
                            {truncateText(review.comment, 70)}
                        </p>
                    </div>
                    <span className="block mt-2 text-sm text-gray-500">
                        {date}
                    </span>
                </div>
                <div onClick={(event) => onMenuClick(event, review)} className='absolute top-2 right-2 z-1'>
                    <CenteredMoreVertIcon />
                </div>
            </div>
        </div>
    );
};

export default ReviewItem;