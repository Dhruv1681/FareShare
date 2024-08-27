
import { lazy, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes, Navigate, Link, useNavigate } from 'react-router-dom';
import { RootState } from '../../state/store/store';
import LandingPageFooterComponent from './LandingPageFooterComponent';
import { useTranslation } from "react-i18next";
import LanguageDropdown from "./LanguageDropdown";

const InformationLazy = lazy(() => import('./InformationComponent'));
const LoginLazy = lazy(() => import('./LoginComponent'));
const RegisterLazy = lazy(() => import('./RegistrationComponent'));
const OtpLazy = lazy(() => import('./OtpComponent'));

const LandingPageComponent = () => {
	const { t } = useTranslation();

	const dataLoaded = useRef(false);

	const navigate = useNavigate();

	const token = useSelector((state: RootState) => state.authReducer.token);
	useEffect(() => {
		if (dataLoaded.current || process.env.NODE_ENV !== 'development') {
			if (token) {
				console.log('token', token, 'navigate to app page');
				navigate('/app/');
			}
		}
		
		return  () => { dataLoaded.current = true; }
	}, [navigate, token]);

	if (token) {
		return <></>;
	}

	return (
		<>	
			<div className="bg-light-grey min-h-100-vh">
				<nav className="navbar bg-grey bg-body-tertiary">
  				<div className="container">
					<div className="col-6">
						<Link to="/">
							<div className="btn font-bold font-2-x hoverable">
								Fair<span className="color-green">Share</span>
							</div>
						</Link>
					</div>
					
					<div className="col-6 text-right d-flex align-items-center ">
						
						<Link to="/home/login">
							<button className="btn mr-4 color-green border-green font-bold text-hover-green">
								{t('SignIn')}
							</button>
						</Link>

						<Link to="/home/register">
							<button className="btn bg-green mr-4 text-white font-bold">
								{t('SignUp')}
							</button>
						</Link>

						<LanguageDropdown />
					</div>
  				</div>
				</nav>

				<div className="container p-4">
					<div className="row justify-content-center align-items-center">
						<Routes>
							<Route index element={<InformationLazy />} />
							<Route path="login" element={<LoginLazy />} />
							<Route path="register" element={<RegisterLazy />} />
							<Route path="otp" element={<OtpLazy />} />
							<Route path="*" element={<Navigate to="/" />} />
						</Routes>
					</div>
				</div>
			</div>
			<LandingPageFooterComponent />
		</>
	);
};

export default LandingPageComponent;
