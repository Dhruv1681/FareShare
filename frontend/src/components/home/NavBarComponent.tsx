import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import AuthService from "../../service/api-service/auth-service";
import ToastService from "../../service/toast-service";
import { resetToken } from "../../state/slice/auth-slice";
import { resetUser } from "../../state/slice/user-slice";
import { AppDispatch, RootState } from "../../state/store/store";

const NavBarComponent = () => {
	const { t, i18n } = useTranslation();

	const dispatch = useDispatch<AppDispatch>();

	const navigate = useNavigate();

	const userState = useSelector((state: RootState) => state.userReducer);

	const languages = [
		{ code: "en", flagIcon: "flag-us", "languageName": "English", },
		{ code: "fr", flagIcon: "flag-fr", "languageName": "Français" },
		{ code: "sp", flagIcon: "flag-sp", "languageName": "Español" },
		{ code: "de", flagIcon: "flag-de", "languageName": "Deutsch" },
	];

	const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

	const languageChange = (language: any) => {
		setSelectedLanguage(language);
		i18n.changeLanguage(language.code);
	}

	const logoutClicked = async () => {
		try {
			const response = await AuthService.remove();
			console.log('logoutClicked response', response);

			dispatch(resetToken());
			dispatch(resetUser());
			navigate('/home');
		} catch (error: any) {
			console.error('Error:', error);
			ToastService.handleError(error);
		}
	};

	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-green position-sticky w-100 p-0">
			<div className="container-fluid d-flex">
				
				<div className="justify-content-start">
					<Link to="/app/dashboard" className="text-decoration-none">
						<div className="btn font-2-x font-bold align-items-center d-flex text-decoration-none">
							<div className="d-inline-block icon-fairshare-topnav mr-4" id="topnav-icon"></div>
							<div className="d-inline-block">Fair<span className="color-white">Share</span></div>
						</div>
					</Link>
				</div>

				<div className="justify-content-end d-flex align-items-center">
					{/* Language Dropdown */}
					<div className="dropdown hoverable d-inline-block mr-4">
						<div
							className="dropdown-toggle font-bold d-flex align-items-center text-white"
							data-toggle="dropdown">
							
							<div className={`icon-flag icon-${selectedLanguage.flagIcon}`}></div>
							<div className="ml-2">
								{selectedLanguage.languageName}
							</div>
						</div>

						<div className="dropdown-menu p-0">
							{languages.map((language, index) => 
								<div
									key={index}
									className="d-flex d-flex align-items-center hover-green p-2"
									onClick={() => languageChange(language)}>
									
									<div className={`icon-flag icon-${language.flagIcon} d-inline-block`}></div>									

									<div className="ml-2 d-inline-block font-bold">
										{language.languageName}
									</div>
								</div>
							)}		
						</div>
					</div>

					{/* User Dropdown */}
					<div className="dropdown hoverable d-inline-block">
						<div
							className="dropdown-toggle font-bold font-2-x color-white mr-4"
							data-toggle="dropdown">
							{userState.fullname}
						</div>

						<div className="dropdown-menu dropdown-menu-right p-0 m-0">
							<div className="dropdown-item hoverable hover-green text-hover-white" onClick={logoutClicked}>
								{t('logout')}
							</div>

							{/* TO test that dropdown shows above content displayed below  */}
							{/* <div className="dropdown-item hoverable hover-green text-hover-white" onClick={logoutClicked}>
								Logout
							</div>

							<div className="dropdown-item hoverable hover-green text-hover-white" onClick={logoutClicked}>
								Logout
							</div> */}

							<div className="arrow-up"></div>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);

};

export default NavBarComponent;
