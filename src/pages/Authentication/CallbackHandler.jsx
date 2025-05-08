import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../APIContext/AuthContext';

const BASE_URL = 'https://aireview.lawfirmgrowthmachine.com/api';

const CallbackHandler = () => {
  const [searchParams] = useSearchParams();  
  const navigate = useNavigate();
  const { setToken } = useAuth();

  useEffect(() => {
    const code = searchParams.get('code');  
    const locationId = searchParams.get('locationId');  

    console.log('Code:', code);
    console.log('Location ID:', locationId);

    if (code && locationId) {
      
      axios.get(`${BASE_URL}/locations-list/`)
        .then(res => {
          console.log("locations-list data:", res.data);
          
         
          const onboarded = res.data.some(loc => loc.location_id === locationId);
          if (!onboarded) {
            console.warn("Location not onboarded.");
            navigate('/');  
            return;
          }

         
          axios.post(`${BASE_URL}/callback/`, { code, locationId })
            .then(() => {
              console.log("Callback API success");

              
              axios.post(`${BASE_URL}/token/`, { locationId })
                .then(res => {
                  const token = res.data.token;
                  setToken(token); 
                  navigate(`/locations?token=${token}&locationId=${locationId}`);  // Navigate with token and locationId
                })
                .catch(err => {
                  console.error("Token error:", err);
                  navigate('/locations');
                });
            })
            .catch(err => {
              console.error("Callback API error:", err);
              navigate('/locations');
            });
        })
        .catch(err => {
          console.error("locations-list error:", err);
          navigate('/locations');
        });
    } else {
      console.warn("Missing code or locationId");
      navigate('/');  
    }
  }, [searchParams, setToken, navigate]); 

  return <p>Processing login...</p>;
};

export default CallbackHandler;
