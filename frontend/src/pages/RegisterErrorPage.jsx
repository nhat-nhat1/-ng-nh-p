import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

export default function RegisterErrorPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get error information from location state or URL params
  const errorType = location.state?.errorType || new URLSearchParams(location.search).get('error') || 'general';
  const errorMessage = location.state?.errorMessage || new URLSearchParams(location.search).get('message') || 'Có lỗi xảy ra khi đăng ký';
  const formData = location.state?.formData || {};

  const getErrorDetails = (type) => {
    switch (type) {
      case 'email_exists':
        return {
          title: 'Email đã tồn tại',
          description: 'Email này đã được sử dụng để đăng ký tài khoản khác. Vui lòng sử dụng email khác hoặc đăng nhập.',
          icon: '📧',
          suggestions: [
            'Sử dụng email khác để đăng ký',
            'Đăng nhập nếu bạn đã có tài khoản',
            'Sử dụng chức năng quên mật khẩu nếu cần'
          ]
        };
      case 'invalid_email':
        return {
          title: 'Email không hợp lệ',
          description: 'Địa chỉ email bạn nhập không đúng định dạng. Vui lòng kiểm tra lại.',
          icon: '✉️',
          suggestions: [
            'Kiểm tra định dạng email (ví dụ: user@example.com)',
            'Đảm bảo không có khoảng trắng thừa',
            'Kiểm tra ký tự đặc biệt'
          ]
        };
      case 'weak_password':
        return {
          title: 'Mật khẩu quá yếu',
          description: 'Mật khẩu của bạn không đủ mạnh. Vui lòng tạo mật khẩu mạnh hơn.',
          icon: '🔒',
          suggestions: [
            'Sử dụng ít nhất 8 ký tự',
            'Bao gồm chữ hoa, chữ thường và số',
            'Thêm ký tự đặc biệt để tăng độ bảo mật'
          ]
        };
      case 'password_mismatch':
        return {
          title: 'Mật khẩu không khớp',
          description: 'Mật khẩu và xác nhận mật khẩu không giống nhau.',
          icon: '🔑',
          suggestions: [
            'Kiểm tra lại mật khẩu đã nhập',
            'Đảm bảo Caps Lock không được bật',
            'Nhập lại mật khẩu một cách cẩn thận'
          ]
        };
      case 'missing_fields':
        return {
          title: 'Thiếu thông tin bắt buộc',
          description: 'Vui lòng điền đầy đủ tất cả các trường bắt buộc.',
          icon: '📝',
          suggestions: [
            'Điền đầy đủ tên người dùng',
            'Nhập địa chỉ email hợp lệ',
            'Tạo mật khẩu và xác nhận mật khẩu'
          ]
        };
      case 'server_error':
        return {
          title: 'Lỗi máy chủ',
          description: 'Có lỗi xảy ra từ phía máy chủ. Vui lòng thử lại sau.',
          icon: '⚠️',
          suggestions: [
            'Thử đăng ký lại sau vài phút',
            'Kiểm tra kết nối internet',
            'Liên hệ hỗ trợ nếu lỗi vẫn tiếp tục'
          ]
        };
      case 'username_taken':
        return {
          title: 'Tên người dùng đã tồn tại',
          description: 'Tên người dùng này đã được sử dụng. Vui lòng chọn tên khác.',
          icon: '👤',
          suggestions: [
            'Chọn tên người dùng khác',
            'Thêm số hoặc ký tự đặc biệt',
            'Sử dụng tên thật hoặc nickname khác'
          ]
        };
      default:
        return {
          title: 'Lỗi đăng ký',
          description: errorMessage,
          icon: '❌',
          suggestions: [
            'Kiểm tra lại thông tin đã nhập',
            'Thử đăng ký lại',
            'Liên hệ hỗ trợ nếu cần thiết'
          ]
        };
    }
  };

  const errorDetails = getErrorDetails(errorType);

  const handleRetryRegister = () => {
    navigate('/register', { state: { formData } });
  };

  const handleGoToLogin = () => {
    navigate('/login', { state: { email: formData.email } });
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password', { state: { email: formData.email } });
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
                {errorType === 'email_exists' ? (
                  <>
                    <button 
                      className="btn btn-primary me-2" 
                      onClick={handleGoToLogin}
                    >
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Đăng nhập
                    </button>
                    <button 
                      className="btn btn-outline-warning me-2" 
                      onClick={handleForgotPassword}
                    >
                      <i className="fas fa-key me-2"></i>
                      Quên mật khẩu?
                    </button>
                    <button 
                      className="btn btn-outline-secondary" 
                      onClick={handleRetryRegister}
                    >
                      <i className="fas fa-user-plus me-2"></i>
                      Thử đăng ký lại
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      className="btn btn-primary me-2" 
                      onClick={handleRetryRegister}
                    >
                      <i className="fas fa-redo me-2"></i>
                      Thử lại
                    </button>
                    <Link 
                      className="btn btn-outline-secondary" 
                      to="/register"
                    >
                      <i className="fas fa-arrow-left me-2"></i>
                      Quay lại đăng ký
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