import notFound from '../../assets/img/errors/not-found.png';
import { ErrorPage } from '../../components/custom/MUI';

const NotFound = () => {
    return (
        <>
            <ErrorPage errorType={404} imageSrc={notFound} />
        </>
    );
};

export default NotFound;