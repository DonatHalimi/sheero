import notAllowed from '../../assets/img/errors/not-allowed.png';
import { ErrorPage } from '../../components/custom/MUI';

const NotAllowed = () => {
    return (
        <>
            <ErrorPage errorType={403} imageSrc={notAllowed} />
        </>
    );
};

export default NotAllowed;