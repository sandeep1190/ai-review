import React from 'react';

const SignIn = () => {
    const handlePopup = () => {
        const width = 500;
        const height = 600;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;

        window.open(
            'http://54.147.18.26/api/login',
            'GoogleSignIn',
            `width=${width},height=${height},top=${top},left=${left}`
        );
    };

    return (
        <div className='sign-in'>
            <h2>Sign in</h2>
            <button onClick={handlePopup}>Sign in with Google</button>
        </div>
    );
};

export default SignIn;
