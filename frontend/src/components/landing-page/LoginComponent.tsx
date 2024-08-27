import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import AuthService from '../../service/api-service/auth-service';
import ToastService from '../../service/toast-service';
import { setEmail as setEmailState } from '../../state/slice/otp-slice';
import { AppDispatch } from '../../state/store/store';

const LoginComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isVisited, setIsVisited] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enteredEmail = e.target.value;
    setEmail(enteredEmail);

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enteredEmail);
    setIsEmailValid(isValidEmail);
  };

  const handleEmailBlur = () => {
    setIsVisited(true);
  };

  const handleContinueClick = async () => {
    console.log('Continue clicked with email:', email);
    if (!isEmailValid) {
      return;
    }

    try {
      const response = await AuthService.sendOTP(email);
      console.log('Response:', response);
      ToastService.handleSuccess(response.message);
      
      dispatch(setEmailState(email));
      navigate('/home/otp');
    } catch (error: any) {
      console.error('Error:', error);
      ToastService.handleError(error);
    }
  };

  return (
    <div className="col-md-6">
      <div className="card rounded-lg">
        <div className="card-body">
          <h5 className="card-title text-left font-bold">
            Login to FairShare
          </h5>

          <div className="form-group mt-4">
            <input
              type="email"
              className={`form-control form-green-focus ${isVisited && !isEmailValid ? 'is-invalid' : ''}`}
              placeholder="Enter email"
              required
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur} />

            {isVisited && !isEmailValid && (
              <div className="invalid-feedback">Invalid email format</div>
            )}
          </div>

          <button
            className="hoverable btn btn-block bg-green font-bold text-white"
            disabled={!isEmailValid}
            onClick={handleContinueClick} >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginComponent;
