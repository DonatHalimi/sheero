import React from 'react';
import { ErrorPageComponent } from '../assets/CustomComponents';
import notFound from '../assets/img/not-found.png';

const NotFound = () => {
    return (
        <>
            <ErrorPageComponent
                errorType={404}
                imageSrc={notFound}
            />
        </>
    );
};

export default NotFound;