import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import AuthService from '../../service/api-service/auth-service';
import LoginUserOtpRequest from '../../service/api-service/schema/request/LoginUserOtpRequest';
import ToastService from '../../service/toast-service';
import { setToken } from '../../state/slice/auth-slice';
import { resetEmail } from '../../state/slice/otp-slice';
import { fetchUser } from '../../state/slice/user-slice';
import { AppDispatch, RootState } from '../../state/store/store';

const OtpComponent: React.FC = () => {
	const dataLoaded = useRef(false);

	const [otp, setOtp] = useState<string>('');
	const [isValidOtp, setIsValidOtp] = useState<boolean>(true);

	const dispatch = useDispatch<AppDispatch>();
	
	const navigate = useNavigate();

	const email = useSelector((state: RootState) => state.otpReducer.email);
	useEffect(() => {
		if (dataLoaded.current || process.env.NODE_ENV !== 'development') {
			if (!email) {
				navigate('/app/dashboard');
			}
		}
		
		return  () => { dataLoaded.current = true; }
	}, [email, navigate]);

	const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setOtp(e.target.value);
	};

	const handleValidateOtpClick = async () => {
		try {
			const isOtpValid = otp.trim() !== '';
			setIsValidOtp(isOtpValid);

			console.log('Validating OTP:', otp);
			if (!isOtpValid) {
				console.log('Invalid OTP');
				return;
			}

			const data: LoginUserOtpRequest = {
				email: email || '',
				otp: otp,
			}
			
			const response = await AuthService.put(data);
			console.log('Response:', response);

			dispatch(resetEmail());
			dispatch(setToken(response.token));
			dispatch(fetchUser());

			navigate('/home');
		} catch (error: any) {
			console.error('Error:', error);
			ToastService.handleError(error);			
		}
	};

	if (!email) {
		return <></>;
	}

	return (
		<div className="col-md-6">
			<div className="card rounded-lg">
				<div className="card-body">
					<h5 className="card-title text-left font-bold">
						Enter OTP for {email}
					</h5>

					<div className="form-group mt-4">
						<input
							type="text"
							className="form-control form-green-focus"
							value={email}
							readOnly
						/>
					</div>

					<div className="form-group mt-4">
						<input
							type="text"
							className={`form-control form-green-focus ${isValidOtp ? '' : 'is-invalid'}`}
							placeholder="Enter OTP"
							required
							value={otp}
							onChange={handleOtpChange}
						/>

						{!isValidOtp && (
							<div className="invalid-feedback">OTP cannot be blank</div>
						)}
					</div>

					<button
						className="hoverable btn btn-block bg-green font-bold text-white"
						onClick={handleValidateOtpClick} >
						Validate OTP
					</button>
				</div>
			</div>
		</div>
	);
};

export default OtpComponent;
