import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

export default function LoginErrorPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get error information from location state or URL params
  const errorType = location.state?.errorType || new URLSearchParams(location.search).get('error') || 'general';
  const errorMessage = location.state?.errorMessage || new URLSearchParams(location.search).get('message') || 'Có lỗi xảy ra khi đăng nhập';
  const email = location.state?.email || '';

  const getErrorDetails = (type) => {
    switch (type) {
      case 'invalid_credentials':
        return {
          title: 'Thông tin đăng nhập không chính xác',
          description: 'Email hoặc mật khẩu bạn nhập không đúng. Vui lòng kiểm tra lại thông tin.',
          icon: '🔐',
          suggestions: [
            'Kiểm tra lại email và mật khẩu',
            'Đảm bảo Caps Lock không được bật',
            'Thử đăng nhập lại'
          ]
        };
      case 'account_not_verified':
        return {
          title: 'Tài khoản chưa được xác thực',
          description: 'Bạn cần xác thực tài khoản trước khi có thể đăng nhập.',
          icon: '📧',
          suggestions: [
            'Kiểm tra email để lấy mã xác thực',
            'Nhập mã OTP để xác thực tài khoản',
            'Nếu không nhận được email, hãy thử gửi lại'
          ]
        };
      case 'account_locked':
        return {
          title: 'Tài khoản đã bị khóa',
          description: 'Tài khoản của bạn đã bị khóa do nhiều lần đăng nhập sai.',
          icon: '🚫',
          suggestions: [
            'Liên hệ với quản trị viên để mở khóa',
            'Thử đăng nhập lại sau 30 phút',
            'Sử dụng chức năng quên mật khẩu'
          ]
        };
      case 'server_error':
        return {
          title: 'Lỗi máy chủ',
          description: 'Có lỗi xảy ra từ phía máy chủ. Vui lòng thử lại sau.',
          icon: '⚠️',
          suggestions: [
            'Thử đăng nhập lại sau vài phút',
            'Kiểm tra kết nối internet',
            'Liên hệ hỗ trợ nếu lỗi vẫn tiếp tục'
          ]
        };
      default:
        return {
          title: 'Lỗi đăng nhập',
          description: errorMessage,
          icon: '❌',
          suggestions: [
            'Thử đăng nhập lại',
            'Kiểm tra thông tin đăng nhập',
            'Liên hệ hỗ trợ nếu cần thiết'
          ]
        };
    }
  };

  const errorDetails = getErrorDetails(errorType);

  const handleRetryLogin = () => {
    navigate('/login', { state: { email } });
  };

  const handleVerifyAccount = () => {
    navigate('/verify-otp', { state: { email } });
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password', { state: { email } });
  };

  return (
    <div className="error-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card error-card">
              <div className="card-body text-center p-5">
              <div className="mb-4">
                <div className="error-icon text-danger">{errorDetails.icon}</div>
                <h2 className="error-title">{errorDetails.title}</h2>
                <p className="error-description">{errorDetails.description}</p>
              </div>

              <div className="suggestions-list">
                <h5>Gợi ý khắc phục:</h5>
                <ul className="list-unstyled text-start">
                  {errorDetails.suggestions.map((suggestion, index) => (
                    <li key={index}>
                      <i className="fas fa-arrow-right me-2"></i>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="action-buttons d-grid gap-2 d-md-flex justify-content-md-center">
                {errorType === 'account_not_verified' ? (
                  <>
                    <button 
                      className="btn btn-primary me-2" 
                      onClick={handleVerifyAccount}
                    >
                      <i className="fas fa-envelope me-2"></i>
                      Xác thực tài khoản
                    </button>
                    <button 
                      className="btn btn-outline-secondary" 
                      onClick={handleRetryLogin}
                    >
                      <i className="fas fa-arrow-left me-2"></i>
                      Quay lại đăng nhập
                    </button>
                  </>
                ) : errorType === 'invalid_credentials' ? (
                  <>
                    <button 
                      className="btn btn-primary me-2" 
                      onClick={handleRetryLogin}
                    >
                      <i className="fas fa-redo me-2"></i>
                      Thử lại
                    </button>
                    <button 
                      className="btn btn-outline-warning" 
                      onClick={handleForgotPassword}
                    >
                      <i className="fas fa-key me-2"></i>
                      Quên mật khẩu?
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      className="btn btn-primary me-2" 
                      onClick={handleRetryLogin}
                    >
                      <i className="fas fa-redo me-2"></i>
                      Thử lại
                    </button>
                    <Link 
                      className="btn btn-outline-secondary" 
                      to="/login"
                    >
                      <i className="fas fa-arrow-left me-2"></i>
                      Quay lại đăng nhập
                    </Link>
                  </>
                )}
              </div>

              <div className="contact-info">
                <small>
                  Nếu bạn vẫn gặp vấn đề, vui lòng{' '}
                  <Link to="/contact">
                    liên hệ hỗ trợ
                  </Link>
                  {' '}hoặc gửi email đến{' '}
                  <a href="mailto:support@example.com">
                    support@example.com
                  </a>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}