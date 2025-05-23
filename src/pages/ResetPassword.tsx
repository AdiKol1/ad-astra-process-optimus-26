import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { passwordResetService } from '@/services/auth/passwordResetService';
import { logger } from '@/utils/logger';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setMessage('Invalid reset link. Please request a new password reset.');
        setIsSuccess(false);
        setIsValidating(false);
        return;
      }

      try {
        const response = await passwordResetService.validatePasswordResetToken(token);
        
        if (response.success) {
          setTokenValid(true);
          setUserEmail(response.email || '');
          logger.info('Password reset token validated', { email: response.email });
        } else {
          setMessage(response.message);
          setIsSuccess(false);
        }
      } catch (error) {
        logger.error('Error validating reset token', { error, token });
        setMessage('Error validating reset link. Please try again.');
        setIsSuccess(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setMessage('Please enter a new password');
      setIsSuccess(false);
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      setIsSuccess(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setIsSuccess(false);
      return;
    }

    if (!token) {
      setMessage('Invalid reset token');
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await passwordResetService.resetPasswordWithToken({
        token,
        newPassword: password,
      });
      
      if (response.success) {
        setMessage('Password reset successfully! Redirecting to login...');
        setIsSuccess(true);
        logger.info('Password reset completed successfully', { email: userEmail });
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/admin/login', { 
            state: { message: 'Password reset successfully. Please log in with your new password.' }
          });
        }, 3000);
      } else {
        setMessage(response.message);
        setIsSuccess(false);
      }
    } catch (error) {
      logger.error('Error during password reset', { error, token });
      setMessage('An error occurred. Please try again.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Validating reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Invalid Reset Link
              </h2>
            </div>

            <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-800 mb-6">
              <p className="text-sm">{message}</p>
            </div>

            <div className="space-y-4">
              <Link 
                to="/admin/forgot-password" 
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Request New Reset Link
              </Link>
              
              <Link 
                to="/admin/login" 
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Reset Password
            </h2>
            <p className="text-gray-600">
              Enter your new password for <strong>{userEmail}</strong>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter new password"
                disabled={isLoading}
                required
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirm new password"
                disabled={isLoading}
                required
                minLength={6}
              />
            </div>

            {/* Message */}
            {message && (
              <div className={`p-4 rounded-md ${
                isSuccess 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <p className="text-sm">{message}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Resetting Password...
                </div>
              ) : isSuccess ? (
                'Password Reset Successfully!'
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          {/* Back to Login */}
          {!isSuccess && (
            <div className="mt-6 text-center">
              <Link 
                to="/admin/login" 
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                ← Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 