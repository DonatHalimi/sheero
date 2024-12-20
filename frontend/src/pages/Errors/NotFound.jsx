import React from 'react';
import { ErrorPage } from '../../assets/CustomComponents';
import notFound from '../../assets/img/errors/not-found.png';

const NotFound = () => {
    return (
        <>
            <ErrorPage
                errorType={404}
                imageSrc={notFound}
            />
        </>
    );
};

export default NotFound;