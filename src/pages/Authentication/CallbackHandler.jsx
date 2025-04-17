import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../APIContext/AuthContext';

const BASE_URL = 'http://54.147.18.26/api';
const locationId = '0OKk2AUg2zJwKTYNwnmf';

const CallbackHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken } = useAuth();

  useEffect(() => {
    const code = searchParams.get('code');

    if (code) {
      axios.post(`${BASE_URL}/callback/`, { code, locationId })
        .then(() => {
          return axios.post(`${BASE_URL}/token/`, { locationId });
        })
        .then(res => {
          setToken(res.data.token);
          navigate('/reviews');
        })
        .catch(err => {
          console.error('OAuth error:', err);
        });
    }
  }, [searchParams, setToken, navigate]);

  return <p>Processing login...</p>;
};

export default CallbackHandler;
