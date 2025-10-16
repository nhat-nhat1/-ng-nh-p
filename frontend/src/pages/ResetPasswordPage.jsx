import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../api/client';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [checking, setChecking] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        await api.get(`/auth/reset/${token}`);
        setChecking(false);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Token không hợp lệ hoặc hết hạn');
        navigate('/forgot-password');
      }
    };
    checkToken();
  }, [token, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) return toast.error('Mật khẩu phải có ít nhất 8 ký tự');
    if (password !== confirmPassword) return toast.error('Mật khẩu xác nhận không khớp');
    setSubmitting(true);
    try {
      const { data } = await api.post('/auth/reset-password', { token, password, confirmPassword });
      toast.success(data.message || 'Đặt lại mật khẩu thành công');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '40vh' }}>
        <div className="spinner-border" />
      </div>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h3 className="mb-3">Đặt lại mật khẩu</h3>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Mật khẩu mới</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
          </div>
          <div className="mb-3">
            <label className="form-label">Xác nhận mật khẩu</label>
            <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? <span className="spinner-border spinner-border-sm" /> : 'Cập nhật mật khẩu'}
          </button>
        </form>
      </div>
    </div>
  );
}
