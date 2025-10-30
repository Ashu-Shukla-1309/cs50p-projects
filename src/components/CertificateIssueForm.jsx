import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { validateCertificateForm } from '../utils/validation';
import { getContract, issueCertificate } from '../utils/blockchain';
import { uploadToIPFS } from '../utils/ipfs';
import { generateCertificatePDF } from '../utils/pdfGenerator';
import { API_URL, CREDENTIAL_TYPES, LOADING_MESSAGES } from '../config/constants';
import { ethers } from 'ethers';

const CertificateIssueForm = ({ walletAddress, institutionData }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    course: '',
    institution: institutionData?.name || '',
    duration: '',
    grade: '',
    credentialType: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  useEffect(() => {
    if (institutionData?.name) {
      setFormData(prev => ({
        ...prev,
        institution: institutionData.name
      }));
    }
  }, [institutionData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validation = validateCertificateForm(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      toast.error('Please fill all fields correctly.');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Generate PDF
      setLoadingMessage(LOADING_MESSAGES.GENERATING_PDF);
      const issueDate = Date.now();

      // Create temporary hash for PDF (will be replaced with real hash)
      const tempHash = '0x' + '0'.repeat(64);

      const pdfData = {
        ...formData,
        issueDate,
        hash: tempHash,
        institutionLogo: institutionData?.logoUrl || ''
      };

      const pdfBlob = await generateCertificatePDF(pdfData);

      // Step 2: Upload to IPFS
      setLoadingMessage(LOADING_MESSAGES.UPLOADING_TO_IPFS);
      const ipfsHash = await uploadToIPFS(pdfBlob);
      console.log('Uploaded to IPFS:', ipfsHash);

      // Step 3: Call smart contract
      setLoadingMessage(LOADING_MESSAGES.RECORDING_ON_BLOCKCHAIN);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(signer);

      const certificateHash = await issueCertificate(contract, formData);
      console.log('Certificate issued with hash:', certificateHash);

      // Step 4: Save to backend
      const response = await axios.post(`${API_URL}/certificates`, {
        hash: certificateHash,
        studentName: formData.studentName,
        course: formData.course,
        institution: formData.institution,
        duration: formData.duration,
        grade: formData.grade,
        credentialType: formData.credentialType,
        issueDate,
        ipfsHash,
        issuerWallet: walletAddress,
        status: 'active'
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(`Certificate issued! Hash: ${certificateHash.substring(0, 10)}...`);

        // Reset form
        setFormData({
          studentName: '',
          course: '',
          institution: institutionData?.name || '',
          duration: '',
          grade: '',
          credentialType: ''
        });

        // Trigger refresh of certificate list
        window.dispatchEvent(new Event('certificateIssued'));
      }
    } catch (error) {
      console.error('Error issuing certificate:', error);

      if (error.message.includes('user rejected')) {
        toast.error('Transaction cancelled by user.');
      } else if (error.message.includes('insufficient funds')) {
        toast.error('Insufficient ETH for gas. Please fund your wallet.');
      } else if (error.message.includes('IPFS')) {
        toast.error('Failed to upload to IPFS. Check connection.');
      } else if (error.message.includes('PDF')) {
        toast.error('Failed to generate PDF. Please try again.');
      } else if (error.response) {
        toast.error('Failed to save certificate data.');
      } else {
        toast.error(error.message || 'Failed to issue certificate. Please try again.');
      }
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Issue Certificate</h2>
        {institutionData && (
          <p style={styles.institutionName}>{institutionData.name}</p>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Student Name */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Student Name *</label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              style={errors.studentName ? { ...styles.input, ...styles.inputError } : styles.input}
              placeholder="John Doe"
              disabled={loading}
            />
            {errors.studentName && <span style={styles.errorText}>{errors.studentName}</span>}
          </div>

          {/* Course */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Course *</label>
            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleChange}
              style={errors.course ? { ...styles.input, ...styles.inputError } : styles.input}
              placeholder="Bachelor of Computer Science"
              disabled={loading}
            />
            {errors.course && <span style={styles.errorText}>{errors.course}</span>}
          </div>

          {/* Institution (read-only) */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Institution</label>
            <input
              type="text"
              name="institution"
              value={formData.institution}
              style={{ ...styles.input, backgroundColor: '#f5f5f5' }}
              disabled
              readOnly
            />
          </div>

          {/* Duration */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Duration *</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              style={errors.duration ? { ...styles.input, ...styles.inputError } : styles.input}
              placeholder="2020-2024"
              disabled={loading}
            />
            {errors.duration && <span style={styles.errorText}>{errors.duration}</span>}
          </div>

          {/* Grade */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Grade *</label>
            <input
              type="text"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              style={errors.grade ? { ...styles.input, ...styles.inputError } : styles.input}
              placeholder="A+"
              disabled={loading}
            />
            {errors.grade && <span style={styles.errorText}>{errors.grade}</span>}
          </div>

          {/* Credential Type */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Credential Type *</label>
            <select
              name="credentialType"
              value={formData.credentialType}
              onChange={handleChange}
              style={errors.credentialType ? { ...styles.select, ...styles.inputError } : styles.select}
              disabled={loading}
            >
              <option value="">Select type...</option>
              {CREDENTIAL_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.credentialType && <span style={styles.errorText}>{errors.credentialType}</span>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={loading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
            disabled={loading}
          >
            {loading ? loadingMessage : 'Issue Certificate'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '24px'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '32px',
    maxWidth: '600px',
    margin: '0 auto'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px'
  },
  institutionName: {
    fontSize: '16px',
    color: '#1976d2',
    fontWeight: '600',
    marginBottom: '24px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
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
  select: {
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    outline: 'none',
    backgroundColor: '#ffffff',
    cursor: 'pointer'
  },
  inputError: {
    borderColor: '#f44336'
  },
  errorText: {
    fontSize: '12px',
    color: '#f44336'
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

export default CertificateIssueForm;
