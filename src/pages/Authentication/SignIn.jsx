import React from 'react';
import GoogleIcon from '../../assets/Icons/GoogleIcon';

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
            <div className='sign-in-container'>
                <h2>Sign in</h2>
                <div className="google-login-button" onClick={handlePopup}>
                    <GoogleIcon />
                    <span>Log in with Google</span>
                </div>
                {/* <button onClick={handlePopup}>Sign in with Google</button> */}
            </div>

        </div>
    );
};

export default SignIn;
