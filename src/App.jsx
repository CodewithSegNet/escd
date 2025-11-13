import React, { useState, useEffect } from 'react';
import { FileText, Upload, X, Plus, Trash2, Eye } from 'lucide-react';
import vector from "./assets/Vector.png"
import signature from "./assets/signatures.png"
import { supabase } from './supabaseClient';


// Admin Login Component
const AdminLogin = ({ onAdminLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    // Simple admin credentials check (you can enhance this with Supabase auth)
    if (username === 'admin' && password === 'admin123') {
      onAdminLogin();
    } else {
      setError('Invalid admin credentials');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-excel-light to-excel-lighter flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center">
          <div className="p-3 rounded-lg">
            <img className="w-12 h-12" src={vector} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-excel-dark mb-2">
          Admin Panel
        </h2>
        <p className="text-center text-excel-gray mb-6">Excel Holdings KYC Management</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-excel-dark mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-excel-border rounded-lg focus:ring-2 focus:ring-excel-primary focus:border-transparent"
              placeholder="Enter admin username"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-excel-dark mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-excel-border rounded-lg focus:ring-2 focus:ring-excel-primary focus:border-transparent"
              placeholder="Enter admin password"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-excel-primary text-white py-2 rounded-lg hover:bg-excel-hover transition-colors font-medium"
          >
            Login as Admin
          </button>
        </div>
      </div>
    </div>
  );
};

// Admin Dashboard Component
const AdminDashboard = ({ onLogout, onBackToUserLogin }) => {
  const [pins, setPins] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [newPin, setNewPin] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPins();
    fetchSubmissions();
  }, []);

  const fetchPins = async () => {
    try {
      const { data, error } = await supabase
        .from('user_pins')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPins(data || []);
    } catch (error) {
      console.error('Error fetching pins:', error);
    }
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('kyc_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPin = async () => {
    if (newPin.length !== 4) {
      alert('PIN must be 4 digits');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_pins')
        .insert([{ pin: newPin }])
        .select();

      if (error) throw error;
      
      setPins([data[0], ...pins]);
      setNewPin('');
      alert('PIN created successfully');
    } catch (error) {
      console.error('Error creating PIN:', error);
      alert('Error creating PIN');
    }
  };

  const deletePin = async (id) => {
    if (!confirm('Are you sure you want to delete this PIN?')) return;

    try {
      const { error } = await supabase
        .from('user_pins')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setPins(pins.filter(p => p.id !== id));
      alert('PIN deleted successfully');
    } catch (error) {
      console.error('Error deleting PIN:', error);
      alert('Error deleting PIN');
    }
  };

  const viewSubmission = (submission) => {
    setSelectedSubmission(submission);
  };

  return (
    <div className="min-h-screen bg-excel-bg py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img className="w-12 h-12" src={vector} />
              <div>
                <h1 className="text-2xl font-bold text-excel-dark">Admin Dashboard</h1>
                <p className="text-sm text-excel-gray">KYC Management System</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onBackToUserLogin}
                className="px-4 py-2 bg-excel-light text-excel-primary rounded-lg hover:bg-excel-lighter transition-colors"
              >
                User Login
              </button>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PIN Management Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-excel-dark mb-4 border-b pb-2">
              PIN Management
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-excel-dark mb-2">
                Create New PIN
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newPin}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 4) setNewPin(value);
                  }}
                  className="flex-1 px-4 py-2 border border-excel-border rounded-lg focus:ring-2 focus:ring-excel-primary focus:border-transparent"
                  placeholder="Enter 4-digit PIN"
                  maxLength="4"
                />
                <button
                  onClick={addPin}
                  className="px-4 py-2 bg-excel-primary text-white rounded-lg hover:bg-excel-hover transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              <h3 className="text-sm font-semibold text-excel-gray mb-2">Active PINs ({pins.length})</h3>
              {pins.map((pin) => (
                <div key={pin.id} className="flex justify-between items-center p-3 bg-excel-light rounded-lg">
                  <div>
                    <span className="font-mono font-bold text-excel-dark">{pin.pin}</span>
                    <p className="text-xs text-excel-gray">
                      Created: {new Date(pin.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => deletePin(pin.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {pins.length === 0 && (
                <p className="text-center text-excel-gray py-4">No PINs created yet</p>
              )}
            </div>
          </div>

          {/* KYC Submissions Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-excel-dark mb-4 border-b pb-2">
              KYC Submissions ({submissions.length})
            </h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-excel-primary mx-auto"></div>
                <p className="text-excel-gray mt-4">Loading submissions...</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {submissions.map((submission) => (
                  <div key={submission.id} className="p-4 bg-excel-light rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-excel-dark">
                          {submission.form_data?.fullName || 'N/A'}
                        </h3>
                        <p className="text-sm text-excel-gray">
                          {submission.form_data?.email || 'No email'}
                        </p>
                        <p className="text-xs text-excel-gray mt-1">
                          Submitted: {new Date(submission.created_at).toLocaleString()}
                        </p>
                        <span className={`inline-block px-2 py-1 text-xs rounded mt-2 ${
                          submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          submission.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {submission.status}
                        </span>
                      </div>
                      <button
                        onClick={() => viewSubmission(submission)}
                        className="p-2 text-excel-primary hover:bg-excel-lighter rounded-lg transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
                {submissions.length === 0 && (
                  <p className="text-center text-excel-gray py-8">No submissions yet</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-excel-dark">Submission Details</h2>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-excel-gray hover:text-excel-dark transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
        <div className="space-y-4">
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="text-sm font-semibold text-excel-dark">Full Name:</label>
      <p className="text-excel-text">{selectedSubmission.form_data?.fullName}</p>
    </div>
    <div>
      <label className="text-sm font-semibold text-excel-dark">Email:</label>
      <p className="text-excel-text">{selectedSubmission.form_data?.email}</p>
    </div>
    <div>
      <label className="text-sm font-semibold text-excel-dark">Phone:</label>
      <p className="text-excel-text">{selectedSubmission.form_data?.phoneNumber}</p>
    </div>
    <div>
      <label className="text-sm font-semibold text-excel-dark">Date of Birth:</label>
      <p className="text-excel-text">{selectedSubmission.form_data?.dateOfBirth}</p>
    </div>
    <div>
      <label className="text-sm font-semibold text-excel-dark">Gender:</label>
      <p className="text-excel-text">{selectedSubmission.form_data?.gender}</p>
    </div>
    <div>
      <label className="text-sm font-semibold text-excel-dark">Nationality:</label>
      <p className="text-excel-text">{selectedSubmission.form_data?.nationality}</p>
    </div>
    <div>
      <label className="text-sm font-semibold text-excel-dark">Occupation:</label>
      <p className="text-excel-text">{selectedSubmission.form_data?.occupation}</p>
    </div>
    <div>
      <label className="text-sm font-semibold text-excel-dark">ID Type:</label>
      <p className="text-excel-text">{selectedSubmission.form_data?.idType}</p>
    </div>
    <div>
      <label className="text-sm font-semibold text-excel-dark">ID Number:</label>
      <p className="text-excel-text">{selectedSubmission.form_data?.idNumber}</p>
    </div>
    <div>
      <label className="text-sm font-semibold text-excel-dark">Date of Issue:</label>
      <p className="text-excel-text">{selectedSubmission.form_data?.dateOfIssue}</p>
    </div>
    <div>
      <label className="text-sm font-semibold text-excel-dark">Date of Expiry:</label>
      <p className="text-excel-text">{selectedSubmission.form_data?.dateOfExpiry}</p>
    </div>
    <div>
      <label className="text-sm font-semibold text-excel-dark">Issuing Authority:</label>
      <p className="text-excel-text">{selectedSubmission.form_data?.issuingAuthority}</p>
    </div>
  </div>

  <div className="border-t pt-4">
    <h3 className="font-bold text-excel-dark mb-2">Address Information</h3>
    <p className="text-excel-text">{selectedSubmission.form_data?.streetAddress}</p>
    <p className="text-excel-text">
      {selectedSubmission.form_data?.city}, {selectedSubmission.form_data?.stateProvince} {selectedSubmission.form_data?.postalCode}
    </p>
    <p className="text-excel-text">{selectedSubmission.form_data?.country}</p>
  </div>

  <div className="border-t pt-4">
    <h3 className="font-bold text-excel-dark mb-2">Proof of Address</h3>
    <p className="text-excel-text">Type: {selectedSubmission.form_data?.proofOfAddressType}</p>
  </div>

  <div className="border-t pt-4">
    <h3 className="font-bold text-excel-dark mb-2">Financial Information</h3>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-sm font-semibold text-excel-dark">Bank Name:</label>
        <p className="text-excel-text">{selectedSubmission.form_data?.bankName}</p>
      </div>
      <div>
        <label className="text-sm font-semibold text-excel-dark">Account Number:</label>
        <p className="text-excel-text">{selectedSubmission.form_data?.accountNumber}</p>
      </div>
      <div>
        <label className="text-sm font-semibold text-excel-dark">Source of Funds:</label>
        <p className="text-excel-text">{selectedSubmission.form_data?.sourceOfFunds}</p>
      </div>
      <div>
        <label className="text-sm font-semibold text-excel-dark">TIN:</label>
        <p className="text-excel-text">{selectedSubmission.form_data?.tin}</p>
      </div>
    </div>
  </div>

  <div className="border-t pt-4">
    <h3 className="font-bold text-excel-dark mb-2">Documents</h3>
    <div className="grid grid-cols-2 gap-2">
      {selectedSubmission.document_urls?.idFront && (
        <a href={selectedSubmission.document_urls.idFront} target="_blank" rel="noopener noreferrer" 
           className="text-excel-primary hover:underline text-sm">View ID Front</a>
      )}
      {selectedSubmission.document_urls?.idBack && (
        <a href={selectedSubmission.document_urls.idBack} target="_blank" rel="noopener noreferrer"
           className="text-excel-primary hover:underline text-sm">View ID Back</a>
      )}
      {selectedSubmission.document_urls?.selfieWithId && (
        <a href={selectedSubmission.document_urls.selfieWithId} target="_blank" rel="noopener noreferrer"
           className="text-excel-primary hover:underline text-sm">View Selfie</a>
      )}
      {selectedSubmission.document_urls?.proofOfAddress && (
        <a href={selectedSubmission.document_urls.proofOfAddress} target="_blank" rel="noopener noreferrer"
           className="text-excel-primary hover:underline text-sm">View Proof of Address</a>
      )}
      {selectedSubmission.document_urls?.signature && (
        <a href={selectedSubmission.document_urls.signature} target="_blank" rel="noopener noreferrer"
           className="text-excel-primary hover:underline text-sm">View Signature</a>
      )}
    </div>
  </div>
</div>
          </div>
        </div>
      )}
    </div>
  );
};

// Login Component (keep existing code exactly as is)
const Login = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (pin.length !== 4) {
      setError('PIN must be 4 digits');
      return;
    }

    // Verify PIN exists in database
    try {
      const { data, error } = await supabase
        .from('user_pins')
        .select('*')
        .eq('pin', pin)
        .single();

      if (error || !data) {
        setError('Invalid PIN');
        return;
      }

      onLogin(name);
    } catch (error) {
      setError('Invalid PIN');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-excel-light to-excel-lighter flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center">
          <div className="p-3 rounded-lg">
            <img className="w-12 h-12" src={vector} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-excel-dark mb-2">
          Excel Holdings
        </h2>
        <p className="text-center text-excel-gray mb-6">KYC Verification Access</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-excel-dark mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-excel-border rounded-lg focus:ring-2 focus:ring-excel-primary focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-excel-dark mb-1">
              PIN Code
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 4) {
                  setPin(value);
                  setError('');
                }
              }}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-excel-border rounded-lg focus:ring-2 focus:ring-excel-primary focus:border-transparent"
              placeholder="Enter 4-digit PIN"
              maxLength="4"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-excel-primary text-white py-2 rounded-lg hover:bg-excel-hover transition-colors font-medium"
          >
            Access Form
          </button>
        </div>
      </div>
    </div>
  );
};


// Thank You Modal Component - UPDATED VERSION
const ThankYouModal = ({ isOpen, onClose, formData, uploads }) => {
  if (!isOpen) return null;

  const generatePDF = async () => {
    // Convert all uploaded images to base64
    const getBase64 = (file) => {
      return new Promise((resolve, reject) => {
        if (!file) {
          resolve('');
          return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    };

    const signatureUrl = uploads.signature ? await getBase64(uploads.signature) : '';
    const idFrontUrl = uploads.idFront ? await getBase64(uploads.idFront) : '';
    const idBackUrl = uploads.idBack ? await getBase64(uploads.idBack) : '';
    const selfieUrl = uploads.selfieWithId ? await getBase64(uploads.selfieWithId) : '';
    const proofAddressUrl = uploads.proofOfAddress ? await getBase64(uploads.proofOfAddress) : '';

    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>KYC Verification Form - ${formData.fullName}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: Arial, sans-serif;
            padding: 30px;
            color: #374151;
            font-size: 11px;
            line-height: 1.3;
          }
          .page {
            page-break-after: always;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }
          .page:last-child { page-break-after: avoid; }
          .header {
            border-bottom: 3px solid #16a34a;
            padding-bottom: 15px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .company-info h1 {
            color: #1f2937;
            margin: 0;
            font-size: 20px;
          }
          .company-info p {
            margin: 3px 0;
            font-size: 10px;
            color: #6b7280;
          }
          .section {
            margin-bottom: 15px;
            page-break-inside: avoid;
          }
          .section h2 {
            color: #16a34a;
            border-bottom: 2px solid #d1d5db;
            padding-bottom: 6px;
            margin-bottom: 10px;
            font-size: 14px;
          }
          .field {
            margin-bottom: 8px;
          }
          .field-label {
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 3px;
            font-size: 10px;
          }
          .field-value {
            color: #374151;
            padding: 3px 0;
            border-bottom: 1px solid #e5e7eb;
            font-size: 10px;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }
          .grid-3 {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 10px;
          }
          .declaration {
            background: #f0fdf4;
            padding: 12px;
            border-left: 4px solid #16a34a;
            font-style: italic;
            margin: 12px 0;
            font-size: 10px;
          }
          .signature-box {
            margin-top: 12px;
          }
          .signature-img {
            max-width: 150px;
            max-height: 70px;
            border: 1px solid #d1d5db;
            padding: 4px;
          }
          .document-img {
            max-width: 200px;
            max-height: 150px;
            border: 1px solid #d1d5db;
            padding: 4px;
            margin: 5px 0;
          }
          .documents-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 10px;
          }
          .document-item {
            text-align: center;
          }
          .document-item p {
            font-weight: bold;
            margin-bottom: 5px;
            font-size: 10px;
          }
          .footer {
            margin-top: 20px;
            padding-top: 12px;
            border-top: 2px solid #16a34a;
            text-align: center;
            color: #6b7280;
            font-size: 10px;
          }
          .intro-text {
            margin: 15px 0;
            font-size: 10px;
            line-height: 1.4;
          }
          .title {
            text-align: center;
            color: #16a34a;
            margin: 20px 0 15px 0;
            font-size: 18px;
          }
          .closing-text {
            margin: 15px 0;
            font-size: 10px;
            line-height: 1.5;
          }
          .signature-section {
            margin-top: 20px;
          }
          .signature-section h3 {
            font-size: 11px;
            margin-bottom: 5px;
          }
          .signature-section p {
            font-size: 10px;
            font-weight: bold;
            margin: 2px 0;
          }
          .signature-footer-img {
            max-width: 150px;
            border-bottom: 1px solid #000;
            margin-bottom: 5px;
          }
          @media print {
            body { padding: 15px; }
            .page { min-height: auto; }
          }
        </style>
      </head>
      <body>
        <!-- PAGE 1 -->
        <div class="page">
          <div class="header">
            <div class="company-info">
              <h1>EXCEL-HOLDINGS</h1>
              <p>HEADQUARTERS</p>
              <p>BRN: 25737754</p>
            </div>
            <div>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
          </div>

          <div style="margin-bottom: 15px;">
            <p style="margin: 0;"><strong>To:</strong> Mr ${formData.fullName}</p>
          </div>

          <h1 class="title">KYC VERIFICATION FORM</h1>

          <p class="intro-text">This note serves to confirm that the KYC verification process for ${formData.fullName}, has been successfully completed as per the regulatory requirements.</p>

          <div class="section">
            <h2>1. Personal Information</h2>
            <div class="grid">
              <div class="field">
                <div class="field-label">Full Name:</div>
                <div class="field-value">${formData.fullName || 'N/A'}</div>
              </div>
              <div class="field">
                <div class="field-label">Date of Birth:</div>
                <div class="field-value">${formData.dateOfBirth || 'N/A'}</div>
              </div>
              <div class="field">
                <div class="field-label">Gender:</div>
                <div class="field-value">${formData.gender || 'N/A'}</div>
              </div>
              <div class="field">
                <div class="field-label">Nationality:</div>
                <div class="field-value">${formData.nationality || 'N/A'}</div>
              </div>
              <div class="field">
                <div class="field-label">Occupation:</div>
                <div class="field-value">${formData.occupation || 'N/A'}</div>
              </div>
              <div class="field">
                <div class="field-label">Email Address:</div>
                <div class="field-value">${formData.email || 'N/A'}</div>
              </div>
              <div class="field">
                <div class="field-label">Phone Number:</div>
                <div class="field-value">${formData.phoneNumber || 'N/A'}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>2. Residential Information</h2>
            <div class="field">
              <div class="field-label">Street Address:</div>
              <div class="field-value">${formData.streetAddress || 'N/A'}</div>
            </div>
            <div class="grid">
              <div class="field">
                <div class="field-label">City:</div>
                <div class="field-value">${formData.city || 'N/A'}</div>
              </div>
              <div class="field">
                <div class="field-label">State/Province/Region:</div>
                <div class="field-value">${formData.stateProvince || 'N/A'}</div>
              </div>
              <div class="field">
                <div class="field-label">Postal/ZIP Code:</div>
                <div class="field-value">${formData.postalCode || 'N/A'}</div>
              </div>
              <div class="field">
                <div class="field-label">Country:</div>
                <div class="field-value">${formData.country || 'N/A'}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>3. Identification Details</h2>
            <div class="grid">
              <div class="field">
                <div class="field-label">Type of ID:</div>
                <div class="field-value">${formData.idType || 'N/A'}</div>
              </div>
              <div class="field">
                <div class="field-label">ID Number:</div>
                <div class="field-value">${formData.idNumber || 'N/A'}</div>
              </div>
              <div class="field">
                <div class="field-label">Date of Issue:</div>
                <div class="field-value">${formData.dateOfIssue || 'N/A'}</div>
              </div>
              <div class="field">
                <div class="field-label">Date of Expiry:</div>
                <div class="field-value">${formData.dateOfExpiry || 'N/A'}</div>
              </div>
              <div class="field">
                <div class="field-label">Issuing Authority:</div>
                <div class="field-value">${formData.issuingAuthority || 'N/A'}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>4. Proof of Address</h2>
            <div class="field">
              <div class="field-label">Document Type:</div>
              <div class="field-value">${formData.proofOfAddressType || 'N/A'}</div>
            </div>
          </div>
        </div>

        <!-- PAGE 2 -->
        <div class="page">
          <div class="section">
            <h2>5. Financial Information</h2>
            <div class="grid">
              <div class="field">
                <div class="field-label">Bank Name:</div>
                <div class="field-value">${formData.bankName || 'N/A'}</div>
              </div>
              <div class="field">
                <div class="field-label">Account Number / IBAN:</div>
                <div class="field-value">${formData.accountNumber || 'N/A'}</div>
              </div>
              <div class="field">
                <div class="field-label">Source of Funds:</div>
                <div class="field-value">${formData.sourceOfFunds || 'N/A'}${formData.sourceOfFunds === 'Other' ? ' - ' + (formData.otherSourceOfFunds || '') : ''}</div>
              </div>
              <div class="field">
                <div class="field-label">Tax Identification Number (TIN):</div>
                <div class="field-value">${formData.tin || 'N/A'}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>6. Uploaded Documents</h2>
            <div class="documents-grid">
              ${idFrontUrl ? `
                <div class="document-item">
                  <p>ID Front:</p>
                  <img src="${idFrontUrl}" class="document-img" alt="ID Front" />
                </div>
              ` : ''}
              ${idBackUrl ? `
                <div class="document-item">
                  <p>ID Back:</p>
                  <img src="${idBackUrl}" class="document-img" alt="ID Back" />
                </div>
              ` : ''}
              ${selfieUrl ? `
                <div class="document-item">
                  <p>Selfie with ID:</p>
                  <img src="${selfieUrl}" class="document-img" alt="Selfie with ID" />
                </div>
              ` : ''}
              ${proofAddressUrl ? `
                <div class="document-item">
                  <p>Proof of Address:</p>
                  <img src="${proofAddressUrl}" class="document-img" alt="Proof of Address" />
                </div>
              ` : ''}
            </div>
          </div>

          <div class="section">
            <h2>7. Declaration</h2>
            <div class="declaration">
              I hereby declare that the information provided is true and accurate to the best 
              of my knowledge and that I am not involved in any money laundering or illegal activity.
            </div>
            <div class="grid">
              <div class="signature-box">
                <div class="field-label">Signature:</div>
                ${signatureUrl ? `<img src="${signatureUrl}" class="signature-img" alt="Signature" />` : '<div style="height: 50px; border-bottom: 1px solid #d1d5db;"></div>'}
              </div>
              <div class="field">
                <div class="field-label">Date:</div>
                <div class="field-value">${formData.signatureDate || 'N/A'}</div>
              </div>
            </div>
          </div>

          <div class="closing-text">
            <p>All information provided by the customer has to be authenticated against official records and it deemed accurate and valid.</p>
            <br>
            <p>We confirm that the KYC requirements for investor has to meet in accordance with our internal policies and applicable regulations.</p>
            <br>
            <p>For any further inquiries or clarifications. Please not do not hesitate to contact us.</p>
          </div>

          <div class="signature-section">
            <h3>Sincerely</h3>
            <div style="margin-top: 10px;">
              <img src="${signature}" class="signature-footer-img" alt="Company Signature" />
              <p>Excelholding,</p>
              <p>Excelonlinecrew</p>
            </div>
          </div>

          <div class="footer">
            <p>✉ Support@E-mineholdings.com | 🌐 E-mineholdings.com</p>
            <p>Excel Holdings - KYC Verification Form</p>
          </div>
        </div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-excel-gray hover:text-excel-dark transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="text-center">
          <div className="bg-excel-light rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-excel-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-excel-dark mb-2">
            Thank You!
          </h2>
          
          <p className="text-excel-gray mb-6">
            Your KYC verification form has been submitted successfully. Our team will review your information and get back to you shortly.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={generatePDF}
              className="w-full bg-excel-primary text-white py-2 rounded-lg hover:bg-excel-hover transition-colors font-medium"
            >
              Export as PDF
            </button>
            
            <button
              onClick={onClose}
              className="w-full bg-excel-light text-excel-primary py-2 rounded-lg hover:bg-excel-lighter transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};



// KYC Form Component (keep all existing code exactly as is)
const KYCForm = ({ userName }) => {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: userName,
    dateOfBirth: '',
    gender: '',
    nationality: '',
    occupation: '',
    email: '',
    phoneNumber: '',
    streetAddress: '',
    city: '',
    stateProvince: '',
    postalCode: '',
    country: '',
    idType: '',
    idNumber: '',
    dateOfIssue: '',
    dateOfExpiry: '',
    issuingAuthority: '',
    proofOfAddressType: '',
    bankName: '',
    accountNumber: '',
    sourceOfFunds: '',
    otherSourceOfFunds: '',
    tin: '',
    signatureDate: new Date().toISOString().split('T')[0]
  });

  const [uploads, setUploads] = useState({
    idFront: null,
    idBack: null,
    selfieWithId: null,
    proofOfAddress: null,
    signature: null
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileUpload = (field, e) => {
    const file = e.target.files[0];
    if (file) {
      setUploads({
        ...uploads,
        [field]: file
      });
    }
  };

  const uploadFileToSupabase = async (file, folder) => {
    if (!file) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('kyc-documents')
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('kyc-documents')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const sendEmailNotification = async (submissionData) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-kyc-email', {
        body: { 
          formData: submissionData.formData,
          documentUrls: submissionData.documentUrls,
          submittedAt: submissionData.created_at
        }
      });

      if (error) throw error;
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const documentUrls = {
        idFront: await uploadFileToSupabase(uploads.idFront, 'id-documents'),
        idBack: await uploadFileToSupabase(uploads.idBack, 'id-documents'),
        selfieWithId: await uploadFileToSupabase(uploads.selfieWithId, 'selfies'),
        proofOfAddress: await uploadFileToSupabase(uploads.proofOfAddress, 'address-proofs'),
        signature: await uploadFileToSupabase(uploads.signature, 'signatures')
      };

      const { data, error } = await supabase
        .from('kyc_submissions')
        .insert([
          {
            form_data: formData,
            document_urls: documentUrls,
            status: 'pending'
          }
        ])
        .select();

      if (error) {
        console.error('Error submitting form:', error);
        alert('Error submitting form. Please try again.');
        return;
      }

      console.log('Form submitted successfully:', data);
      
      await sendEmailNotification(data[0]);
      
      setShowModal(true);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-excel-bg py-8 px-4">
      <ThankYouModal isOpen={showModal} onClose={() => setShowModal(false)} formData={formData} uploads={uploads} />
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden relative">
          {/* Watermark Logo */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <img 
              src={vector}
              alt="Watermark"
              className="w-[600px] h-[600px] object-contain opacity-20"
            />
          </div>

          {/* Content */}
          <div className="relative z-10 p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b-2 border-excel-primary">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg">
                  <img className="w-14 h-14" src={vector} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-excel-dark">
                    EXCEL-HOLDINGS
                  </h1>
                  <p className="text-xs text-excel-gray">HEADQUARTERS</p>
                  <p className="text-xs text-excel-muted">BRN: 25737754</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-excel-gray">
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* To Section */}
            <div className="mb-6">
              <p className="text-sm text-excel-gray">To:</p>
              <p className="font-semibold text-excel-dark">{userName}</p>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center text-excel-primary mb-4">
              KYC VERIFICATION FORM
            </h2>

            <p className='px-6'>This note serves to confirm that the KYC verification process for <span>{userName}</span>, has been successfully completed as per the regulatory requirements.</p>

            {/* Section 1: Personal Information */}
            <div className="mb-8 p-6 rounded-lg">
              <h3 className="font-bold text-lg text-excel-dark mb-4 border-b pb-2">
                1. Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-excel-dark mb-2">
                    Full Name:
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full border-b-2 border-excel-border focus:border-excel-primary outline-none py-2 text-excel-text bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-excel-dark mb-2">
                    Date of Birth:
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full border-b-2 border-excel-border focus:border-excel-primary outline-none py-2 text-excel-text bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-excel-dark mb-2">
                    Gender:
                  </label>
                  <div className="flex space-x-4">
                    {['Male', 'Female', 'Other'].map((gender) => (
                      <label key={gender} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value={gender}
                          checked={formData.gender === gender}
                          onChange={handleChange}
                          className="w-4 h-4 text-excel-primary"
                        />
                        <span className="text-sm text-excel-text">{gender}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-excel-dark mb-2">
                    Nationality:
                  </label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    className="w-full border-b-2 border-excel-border focus:border-excel-primary outline-none py-2 text-excel-text bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-excel-dark mb-2">
                    Occupation:
                  </label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    className="w-full border-b-2 border-excel-border focus:border-excel-primary outline-none py-2 text-excel-text bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-excel-dark mb-2">
                    Email Address:
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border-b-2 border-excel-border focus:border-excel-primary outline-none py-2 text-excel-text bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-excel-dark mb-2">
                    Phone Number:
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full border-b-2 border-excel-border focus:border-excel-primary outline-none py-2 text-excel-text bg-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Residential Information */}
            <div className="mb-8 p-6  rounded-lg">
              <h3 className="font-bold text-lg text-excel-dark mb-4 border-b pb-2">
                2. Residential Information
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-excel-dark mb-2">
                    Street Address:
                  </label>
                  <input
                    type="text"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    className="w-full border-b-2 border-excel-border focus:border-excel-primary outline-none py-2 text-excel-text bg-transparent"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-excel-dark mb-2">
                      City:
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full border-b-2 border-excel-border focus:border-excel-primary outline-none py-2 text-excel-text bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-excel-dark mb-2">
                      State/Province/Region:
                    </label>
                    <input
                      type="text"
                      name="stateProvince"
                      value={formData.stateProvince}
                      onChange={handleChange}
                      className="w-full border-b-2 border-excel-border focus:border-excel-primary outline-none py-2 text-excel-text bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-excel-dark mb-2">
                      Postal/ZIP Code:
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full border-b-2 border-excel-border focus:border-excel-primary outline-none py-2 text-excel-text bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-excel-dark mb-2">
                      Country:
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full border-b-2 border-excel-border focus:border-excel-primary outline-none py-2 text-excel-text bg-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Identification Details */}
            <div className="mb-8 p-6  rounded-lg">
              <h3 className="font-bold text-lg text-excel-dark mb-4 border-b pb-2">
                3. Identification Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-excel-dark mb-2">
                    Type of ID Provided:
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Passport', 'Driver\'s License', 'National ID', 'Voter\'s Card'].map((id) => (
                      <label key={id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="idType"
                          value={id}
                          checked={formData.idType === id}
                          onChange={handleChange}
                          className="w-4 h-4 text-excel-primary"
                        />
                        <span className="text-sm text-excel-text">{id}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-excel-dark mb-2">
                      ID Number:
                    </label>
                    <input
                      type="text"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleChange}
                      className="w-full border-b-2 border-excel-border focus:border-excel-primary outline-none py-2 text-excel-text bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-excel-dark mb-2">
                      Date of Issue:
                    </label>
                    <input
                      type="date"
                      name="dateOfIssue"
                      value={formData.dateOfIssue}
                      onChange={handleChange}
                      className="w-full border-b-2 border-excel-border focus:border-excel-primary outline-none py-2 text-excel-text bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-excel-dark mb-2">
                      Date of Expiry:
                    </label>
                    <input
                      type="date"
                      name="dateOfExpiry"
                      value={formData.dateOfExpiry}
                      onChange={handleChange}
                      className="w-full border-b-2 border-excel-border focus:border-excel-primary outline-none py-2 text-excel-text bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-excel-dark mb-2">
                      Issuing Authority:
                    </label>
                    <input
                      type="text"
                      name="issuingAuthority"
                      value={formData.issuingAuthority}
                      onChange={handleChange}
                      className="w-full border-b-2 border-excel-border focus:border-excel-primary outline-none py-2 text-excel-text bg-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-semibold text-excel-dark mb-2">
                      Upload ID (Front):
                    </label>
                    <label className="flex items-center justify-center px-4 py-2 bg-excel-light border-2 border-dashed border-excel-primary rounded-lg cursor-pointer hover:bg-excel-lighter transition">
                      <Upload className="w-5 h-5 text-excel-primary mr-2" />
                      <span className="text-sm text-excel-primary">
                        {uploads.idFront ? uploads.idFront.name : 'Choose File'}
                      </span>
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload('idFront', e)}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-excel-dark mb-2">
                      Upload ID (Back):
                    </label>
                    <label className="flex items-center justify-center px-4 py-2 bg-excel-light border-2 border-dashed border-excel-primary rounded-lg cursor-pointer hover:bg-excel-lighter transition">
                      <Upload className="w-5 h-5 text-excel-primary mr-2" />
                      <span className="text-sm text-excel-primary">
                        {uploads.idBack ? uploads.idBack.name : 'Choose File'}
                      </span>
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload('idBack', e)}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-excel-dark mb-2">
                      Upload Selfie Holding ID:
                    </label>
                    <label className="flex items-center justify-center px-4 py-2 bg-excel-light border-2 border-dashed border-excel-primary rounded-lg cursor-pointer hover:bg-excel-lighter transition">
                      <Upload className="w-5 h-5 text-excel-primary mr-2" />
                      <span className="text-sm text-excel-primary">
                        {uploads.selfieWithId ? uploads.selfieWithId.name : 'Choose File'}
                      </span>
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload('selfieWithId', e)}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Proof of Address */}
            <div className="mb-8 p-6 rounded-lg">
              <h3 className="font-bold text-lg text-excel-dark mb-4 border-b pb-2">
                4. Proof of Address
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-excel-dark mb-2">
                    Document Type:
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Utility Bill', 'Bank Statement', 'Lease Agreement', 'Tax Bill'].map((doc) => (
                      <label key={doc} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="proofOfAddressType"
                          value={doc}
                          checked={formData.proofOfAddressType === doc}
                          onChange={handleChange}
                          className="w-4 h-4 text-excel-primary"
                        />
                        <span className="text-sm text-excel-text">{doc}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-excel-dark mb-2">
                    Upload Proof of Address:
                  </label>
                  <label className="flex items-center justify-center px-4 py-3 bg-excel-light border-2 border-dashed border-excel-primary rounded-lg cursor-pointer hover:bg-excel-lighter transition w-full md:w-1/2">
                    <Upload className="w-5 h-5 text-excel-primary mr-2" />
                    <span className="text-sm text-excel-primary">
                      {uploads.proofOfAddress ? uploads.proofOfAddress.name : 'Choose File'}
                    </span>
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload('proofOfAddress', e)}
                      className="hidden"
                      accept="image/*,.pdf"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Section 5: Financial Information */}
            <div className="mb-8 p-6 rounded-lg">
              <h3 className="font-bold text-lg text-excel-dark mb-4 border-b pb-2">
                5. Financial Information (if required)
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-excel-dark mb-2">
                      Bank Name:
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      className="w-full border-b-2 border-excel-border focus:border-excel-primary outline-none py-2 text-excel-text bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-excel-dark mb-2">
                      Account Number / IBAN:
                    </label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      className="w-full border-b-2 border-excel-border focus:border-excel-primary outline-none py-2 text-excel-text bg-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-excel-dark mb-2">
                    Source of Funds:
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
                    {['Salary', 'Business Income', 'Investment Returns', 'Other'].map((source) => (
                      <label key={source} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="sourceOfFunds"
                          value={source}
                          checked={formData.sourceOfFunds === source}
                          onChange={handleChange}
                          className="w-4 h-4 text-excel-primary"
                        />
                        <span className="text-sm text-excel-text">{source}</span>
                      </label>
                    ))}
                  </div>
                  {formData.sourceOfFunds === 'Other' && (
                    <input
                      type="text"
                      name="otherSourceOfFunds"
                      value={formData.otherSourceOfFunds}
                      onChange={handleChange}
                      placeholder="Please specify"
                      className="w-full border-b-2 border-excel-border focus:border-excel-primary outline-none py-2 text-excel-text bg-transparent mt-2"
                    />
                  )}
                </div>
                <div>
<label className="block text-sm font-semibold text-excel-dark mb-2">
                    Tax Identification Number (TIN):
                  </label>
                  <input
                    type="text"
                    name="tin"
                    value={formData.tin}
                    onChange={handleChange}
                    className="w-full border-b-2 border-excel-border focus:border-excel-primary outline-none py-2 text-excel-text bg-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Section 6: Declaration */}
            <div className="mb-8 p-6 bg-excel-declaration rounded-lg border-l-4 border-excel-primary">
              <h3 className="font-bold text-lg text-excel-dark mb-4 border-b pb-2">
                6. Declaration
              </h3>
              <p className="text-sm text-excel-text mb-4 italic leading-relaxed">
                I hereby declare that the information provided is true and accurate to the best 
                of my knowledge and that I am not involved in any money laundering or illegal activity.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-excel-dark mb-2">
                    Signature:
                  </label>
                  <label className="flex items-center justify-center px-4 py-3 bg-excel-light border-2 border-dashed border-excel-primary rounded-lg cursor-pointer hover:bg-excel-lighter transition">
                    <Upload className="w-5 h-5 text-excel-primary mr-2" />
                    <span className="text-sm text-excel-primary">
                      {uploads.signature ? uploads.signature.name : 'Upload Signature'}
                    </span>
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload('signature', e)}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                  {uploads.signature && (
                    <div className="mt-2">
                      <img 
                        src={URL.createObjectURL(uploads.signature)} 
                        alt="Signature Preview" 
                        className="max-h-20 border border-excel-border p-1 rounded"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-excel-dark mb-2">
                    Date:
                  </label>
                  <input
                    type="date"
                    name="signatureDate"
                    value={formData.signatureDate}
                    onChange={handleChange}
                    className="w-full border-b-2 border-excel-border focus:border-excel-primary outline-none py-2 text-excel-text bg-transparent"
                  />
                </div>
              </div>
            </div>

            <div className='mb-6 px-6'>
              <p>
                All information provided by the customer has to be authenticated against official records and it deemed accurate and valid.

                We confirm that the KYC requirements for investor has to meet in accordance with our internal policies and applicable regulations.

                For any further inquiries or clarifications. Please not do not hesitate to contact us.
              </p>

              <h2>
                Sincerely
              </h2>

              <div className='w-fit'>
                <img src={signature} className="underline" alt="" />
                <hr className='bg-black' />
                <h2 className='font-bold'>Excelholding,</h2>
                <h2 className='font-bold'>Excelonlinecrew</h2>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-excel-primary text-white py-3 rounded-lg hover:bg-excel-hover transition-colors font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit KYC Form'}
            </button>

            {/* Contact Footer */}
            <div className="mt-8 bg-excel-primary -mx-8 -mb-8 p-4 flex flex-col md:flex-row items-center justify-center md:space-x-8 space-y-2 md:space-y-0 text-white text-sm">
              <div className="flex items-center space-x-2">
                <span>✉</span>
                <span>Support@E-mineholdings.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🌐</span>
                <span>E-mineholdings.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component with routing logic
const App = () => {
  const [view, setView] = useState('userLogin'); // 'userLogin', 'adminLogin', 'adminDashboard', 'kycForm'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  const handleUserLogin = (name) => {
    setUserName(name);
    setIsLoggedIn(true);
    setView('kycForm');
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    setView('adminDashboard');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setView('adminLogin');
  };

  const handleBackToUserLogin = () => {
    setView('userLogin');
  };

  const handleSwitchToAdmin = () => {
    setView('adminLogin');
  };

  const handleSwitchToUser = () => {
    setView('userLogin');
  };

  return (
    <div>
      {view === 'userLogin' && (
        <div className="relative">
          <Login onLogin={handleUserLogin} />
          <button
            onClick={handleSwitchToAdmin}
            className="fixed bottom-4 right-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm shadow-lg"
          >
            Admin Login
          </button>
        </div>
      )}

      {view === 'adminLogin' && (
        <div className="relative">
          <AdminLogin onAdminLogin={handleAdminLogin} />
          <button
            onClick={handleSwitchToUser}
            className="fixed bottom-4 right-4 px-4 py-2 bg-excel-primary text-white rounded-lg hover:bg-excel-hover transition-colors text-sm shadow-lg"
          >
            User Login
          </button>
        </div>
      )}

      {view === 'adminDashboard' && (
        <AdminDashboard 
          onLogout={handleAdminLogout} 
          onBackToUserLogin={handleBackToUserLogin}
        />
      )}

      {view === 'kycForm' && <KYCForm userName={userName} />}
    </div>
  );
};

export default App;