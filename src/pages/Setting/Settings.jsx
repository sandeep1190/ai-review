import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useTemplate } from "../../APIContext/TemplateContext"; 
import './Settings.scss';

const Settings = () => {
  const { locationId } = useParams();
  const [formData, setFormData] = useState({
    facebook_url: '',
    twitter_url: '',
    google_bp_url: '',
    insta_url: '',
    default_template: '',
    template1_url: '',
    template2_url: '',
    template3_url: '',
    template4_url: ''
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('review_token');

  const { setSelectedTemplateUrl } = useTemplate(); // Access the context to set the selected template URL

  useEffect(() => {
    const fetchSettings = async () => {
      if (!token) return;
      try {
        const res = await axios.get(
          `https://aireview.lawfirmgrowthmachine.com/api/settings/locations/${locationId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFormData(res.data);
        // Set the default template URL to the selected template in the context
        const defaultTemplateKey = res.data.default_template?.toLowerCase() + '_url';
        setSelectedTemplateUrl(res.data[defaultTemplateKey]);
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [locationId, token, setSelectedTemplateUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert('No auth token');
    try {
      await axios.post(
        `https://aireview.lawfirmgrowthmachine.com/api/settings/locations/${locationId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update the selected template URL after form submission
      const updatedTemplateKey = formData.default_template?.toLowerCase() + '_url';
      setSelectedTemplateUrl(formData[updatedTemplateKey]);
      alert('Settings updated successfully!');
    } catch (err) {
      alert('Failed to update settings');
      console.error(err);
    }
  };

  if (loading) return <p>Loading settings…</p>;

  return (
    <div className="settings-page">
      <div className="settings-card">
        <h2>Location Settings</h2>
        <form onSubmit={handleSubmit} className="settings-form">
          {['facebook_url', 'twitter_url', 'google_bp_url', 'insta_url'].map((field) => (
            <div className="form-group" key={field}>
              <label htmlFor={field}>{field.replace(/_/g, ' ').toUpperCase()}</label>
              <input
                type="text"
                id={field}
                name={field}
                value={formData[field] ?? ''}
                onChange={handleChange}
              />
            </div>
          ))}

          <div className="form-group">
            <label>Choose Template</label>
            <div className="radio-buttons template-preview-list">
              {[1, 2, 3, 4].map((num) => (
                <label key={num} className="template-radio">
                  <input
                    type="radio"
                    name="default_template"
                    value={`Template${num}`}
                    checked={formData.default_template === `Template${num}`}
                    onChange={handleChange}
                  />
                  <img
                    src={formData[`template${num}_url`] || ''}
                    alt={`Template ${num}`}
                    className="template-image"
                  />
                  <span>Template {num}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="templateupdate">
            <label>Update Template URLs</label>
            <div className="template-field">
              {[1, 2, 3, 4].map((num) => (
                <div className="form-group template-group" key={num}>
                  <input
                    type="text"
                    name={`template${num}_url`}
                    value={formData[`template${num}_url`] ?? ''}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="save-button">Update</button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
