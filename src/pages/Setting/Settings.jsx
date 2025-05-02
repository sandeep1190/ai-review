import React, { useEffect, useState } from 'react';
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

  const { setSelectedTemplateUrl } = useTemplate();

  useEffect(() => {
    const fetchSettings = async () => {
      if (!token) return;
      try {
        const res = await axios.get(
          `https://aireview.lawfirmgrowthmachine.com/api/settings/locations/${locationId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFormData(res.data);

        // Detect and set selected template URL from the key name
        const defaultTemplateKey = res.data.default_template?.toLowerCase().includes('template')
          ? res.data.default_template?.toLowerCase() + '_url'
          : '';
        if (defaultTemplateKey && res.data[defaultTemplateKey]) {
          setSelectedTemplateUrl(res.data[defaultTemplateKey]);
        }
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
  
    // Determine which template was selected (e.g., "Template3")
    const selectedTemplateName = formData.default_template;
  
    // Get its corresponding URL
    const selectedTemplateKey = selectedTemplateName?.toLowerCase() + '_url';
    const selectedTemplateUrl = formData[selectedTemplateKey];
  
    const updatedFormData = {
      ...formData,
      default_template: selectedTemplateUrl
    };
  
    try {
      const res = await axios.post(
        `https://aireview.lawfirmgrowthmachine.com/api/settings/locations/${locationId}`,
        updatedFormData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setSelectedTemplateUrl(selectedTemplateUrl);
      alert('Settings updated successfully!');
      console.log('Updated data sent:', updatedFormData);
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
                    checked={formData.default_template === `Template${num}` || formData.default_template === formData[`template${num}_url`]}
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
                    placeholder={`Template ${num} URL`}
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
