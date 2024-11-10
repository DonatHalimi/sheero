import React from 'react';
import { ErrorPageComponent } from '../../assets/CustomComponents';
import notAllowed from '../../assets/img/errors/not-allowed.png';

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