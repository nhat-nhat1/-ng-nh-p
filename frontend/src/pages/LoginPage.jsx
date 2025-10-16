import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../api/client';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      toast.success('Đăng nhập thành công');
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || 'Có lỗi xảy ra';
      const status = err.response?.status;
      
      // Determine error type for error page
      let errorType = 'general';
      if (status === 401) {
        errorType = 'invalid_credentials';
      } else if (status === 403 && err.response?.data?.redirect) {
        navigate('/verify-otp', { state: { email } });
        return;
      } else if (status === 500) {
        errorType = 'server_error';
      }
      
      // Show toast for minor errors, redirect to error page for major ones
      if (errorType === 'invalid_credentials' || errorType === 'server_error') {
        navigate('/login-error', { 
          state: { 
            errorType, 
            errorMessage: message, 
            email 
          } 
        });
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h3 className="mb-3">Đăng nhập</h3>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Mật khẩu</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm" /> : 'Đăng nhập'}
          </button>
          <div className="mt-3">
            <Link to="/forgot-password">Quên mật khẩu?</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
