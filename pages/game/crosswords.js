import LandingHeader from '@/components/pages/LandingPage/LandingHeader';
import React from 'react';

const Crosswords = () => {
    return (
        <div>
            <LandingHeader/>
            <div className='pt-20'>
            <iframe src="https://learningapps.org/watch?app=26176392" style={{border: "0px", width: "100%", height: "90vh"}} allowFullScreen={true}></iframe>
            </div>
        </div>
    );
};

export default Crosswords;