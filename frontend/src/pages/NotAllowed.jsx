import React from 'react';
import { ErrorPageComponent } from '../assets/CustomComponents';
import notAllowed from '../assets/img/not-found.png';

const NotAllowed = () => {
    return (
        <>
            <ErrorPageComponent
                errorType={403}
                imageSrc={notAllowed}
            />
        </>
    );
};

export default NotAllowed;