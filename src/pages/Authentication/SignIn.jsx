import React from 'react';
import GoogleIcon from '../../assets/Icons/GoogleIcon';

const SignIn = () => {
    const handleOpenInNewTab = () => {
        window.open(
            'https://aireview.lawfirmgrowthmachine.com/api/login',
            '_blank'
        );
    };

    return (
        <div className='sign-in'>
            <div className='sign-in-container'>
                <h2>Sign in</h2>
                <div className="google-login-button" onClick={handleOpenInNewTab}>
                    <GoogleIcon />
                    <span>Log in with Google</span>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
