import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { validateInstitutionForm } from '../utils/validation';
import { API_URL } from '../config/constants';

const InstitutionSetup = ({ walletAddress, onComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    logoUrl: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    // Validate individual field on blur
    const validation = validateInstitutionForm(formData);
    if (validation.errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validation.errors[name]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const validation = validateInstitutionForm(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      toast.error('Please fill all fields correctly.');
      return;
    }

    setLoading(true);

    try {
      // Submit to backend
      const response = await axios.post(`${API_URL}/institutions`, {
        walletAddress,
        name: formData.name,
        website: formData.website,
        logoUrl: formData.logoUrl,
        registeredAt: Date.now()
      });

      if (response.status === 200 || response.status === 201) {
        toast.success('Institution registered successfully!');
        onComplete();
      }
    } catch (error) {
      console.error('Error registering institution:', error);
      if (error.response) {
        toast.error(error.response.data.error || 'Registration failed. Please try again.');
      } else if (error.request) {
        toast.error('Unable to register institution. Please check your connection.');
      } else {
        toast.error('Registration failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Register Your Institution</h2>
        <p style={styles.subtitle}>Complete this one-time setup to start issuing certificates</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Institution Name */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Institution Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              style={errors.name ? { ...styles.input, ...styles.inputError } : styles.input}
              placeholder="Example University"
              disabled={loading}
            />
            {errors.name && <span style={styles.errorText}>{errors.name}</span>}
          </div>

          {/* Website */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Website *</label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              onBlur={handleBlur}
              style={errors.website ? { ...styles.input, ...styles.inputError } : styles.input}
              placeholder="https://example.edu"
              disabled={loading}
            />
            {errors.website && <span style={styles.errorText}>{errors.website}</span>}
          </div>

          {/* Logo URL */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Logo URL *</label>
            <input
              type="text"
              name="logoUrl"
              value={formData.logoUrl}
              onChange={handleChange}
              onBlur={handleBlur}
              style={errors.logoUrl ? { ...styles.input, ...styles.inputError } : styles.input}
              placeholder="https://example.edu/logo.png"
              disabled={loading}
            />
            {errors.logoUrl && <span style={styles.errorText}>{errors.logoUrl}</span>}
            <span style={styles.helpText}>Must be a PNG, JPG, JPEG, or SVG image</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={loading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register Institution'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 64px)',
    padding: '24px',
    backgroundColor: '#f5f5f5'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '40px',
    maxWidth: '500px',
    width: '100%'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '32px',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333'
  },
  input: {
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  inputError: {
    borderColor: '#f44336'
  },
  errorText: {
    fontSize: '12px',
    color: '#f44336',
    marginTop: '4px'
  },
  helpText: {
    fontSize: '12px',
    color: '#999',
    marginTop: '4px'
  },
  button: {
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#1976d2',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginTop: '8px'
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed'
  }
};

export default InstitutionSetup;
