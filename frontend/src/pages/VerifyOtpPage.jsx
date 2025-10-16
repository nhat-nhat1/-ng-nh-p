import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../api/client';

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || '';
  const [email, setEmail] = useState(emailFromState);
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otpCode)) {
      return toast.error('OTP phải gồm 6 chữ số');
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otpCode });
      toast.success(data.message);
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setResending(true);
    try {
      const { data } = await api.post('/auth/resend-otp', { email });
      toast.success(data.message || 'Đã gửi lại OTP');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h3 className="mb-3">Xác thực OTP</h3>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Mã OTP</label>
            <input className="form-control" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} maxLength={6} required />
          </div>
          <div className="d-flex align-items-center gap-2">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm" /> : 'Xác thực'}
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={resendOtp} disabled={resending}>
              {resending ? <span className="spinner-border spinner-border-sm" /> : 'Gửi lại OTP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
