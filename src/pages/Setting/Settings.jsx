import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTemplate } from '../../APIContext/TemplateContext';
import { useSettings } from '../../APIContext/SettingsContext';
import './Settings.scss';

const Settings = () => {
  const { locationId } = useParams();
  const { settings, fetchSettings, updateSettings, loading } = useSettings();
  const { setSelectedTemplateUrl } = useTemplate();

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

  useEffect(() => {
    const loadSettings = async () => {
      const data = await fetchSettings(locationId);
      if (data) {
        setFormData(data);
        const key = data.default_template?.toLowerCase();
        const url = data[`${key}_url`];
        if (url) setSelectedTemplateUrl(url);
      }
    };
    loadSettings();
  }, [locationId, fetchSettings, setSelectedTemplateUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedTemplate = formData.default_template?.toLowerCase();
    const selectedTemplateUrl = formData[`${selectedTemplate}_url`];

    if (!selectedTemplateUrl) {
      alert('Please ensure the selected template has a valid URL.');
      return;
    }

    const updatedData = {
      ...formData,
      default_template: selectedTemplateUrl
    };

    const success = await updateSettings(locationId, updatedData);
    if (success) {
      setSelectedTemplateUrl(selectedTemplateUrl);
      alert('Settings updated successfully!');
    } else {
      alert('Failed to update settings.');
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
                    checked={
                      formData.default_template === `Template${num}` ||
                      formData.default_template === formData[`template${num}_url`]
                    }
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
