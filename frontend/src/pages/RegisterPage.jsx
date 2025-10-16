import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../api/client';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      toast.success(data.message || 'Đăng ký thành công');
      navigate('/verify-otp', { state: { email: form.email } });
    } catch (err) {
      const message = err.response?.data?.message || 'Có lỗi xảy ra';
      const status = err.response?.status;
      
      // Determine error type for error page
      let errorType = 'general';
      if (message.includes('Email đã tồn tại')) {
        errorType = 'email_exists';
      } else if (message.includes('Email không hợp lệ')) {
        errorType = 'invalid_email';
      } else if (message.includes('Mật khẩu phải có ít nhất 8 ký tự')) {
        errorType = 'weak_password';
      } else if (message.includes('Mật khẩu xác nhận không khớp')) {
        errorType = 'password_mismatch';
      } else if (message.includes('Vui lòng điền đầy đủ thông tin')) {
        errorType = 'missing_fields';
      } else if (status === 500) {
        errorType = 'server_error';
      }
      
      // Redirect to error page for major errors, show toast for minor ones
      if (['email_exists', 'invalid_email', 'weak_password', 'password_mismatch', 'missing_fields', 'server_error'].includes(errorType)) {
        navigate('/register-error', { 
          state: { 
            errorType, 
            errorMessage: message, 
            formData: form 
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
        <h3 className="mb-3">Đăng ký</h3>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Tên người dùng</label>
            <input className="form-control" name="username" value={form.username} onChange={onChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" name="email" value={form.email} onChange={onChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Mật khẩu</label>
            <input type="password" className="form-control" name="password" value={form.password} onChange={onChange} required minLength={8} />
          </div>
          <div className="mb-3">
            <label className="form-label">Xác nhận mật khẩu</label>
            <input type="password" className="form-control" name="confirmPassword" value={form.confirmPassword} onChange={onChange} required minLength={8} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm" /> : 'Đăng ký'}
          </button>
        </form>
      </div>
    </div>
  );
}
