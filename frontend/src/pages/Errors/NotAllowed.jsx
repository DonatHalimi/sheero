import React from 'react';
import { ErrorPage } from '../../assets/CustomComponents';
import notAllowed from '../../assets/img/errors/not-allowed.png';

const NotAllowed = () => {
    return (
        <>
            <ErrorPage errorType={403} imageSrc={notAllowed} />
        </>
    );
};

export default NotAllowed;