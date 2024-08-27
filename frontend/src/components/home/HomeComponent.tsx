import { useEffect, lazy, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { RootState } from '../../state/store/store';

const NavBarLazy = lazy(() => import('./NavBarComponent'));
const SidePanelLazy = lazy(() => import('./SidePanelComponent'));

const DashboardLazy = lazy(() => import('../dashboard/DashboardComponent'));
const ExpensesLazy = lazy(() => import('../expenses/ExpensesComponent'));
const GroupsLazy = lazy(() => import('../groups/GroupsComponent'));
const FriendsLazy = lazy(() => import('../friends/FriendsComponent'));
const ActivityLazy = lazy(() => import('../activity/ActivityComponent'));
const SettingsLazy = lazy(() => import('../settings/SettingsComponent'));

const HomeComponent = () => {
	const dataLoaded = useRef(false);

	const navigate = useNavigate();

	const token = useSelector((state: RootState) => state.authReducer.token);

	useEffect(() => {
		if (dataLoaded.current || process.env.NODE_ENV !== 'development') {
			if (!token) {
				console.log('token', token, 'navigate to home page');
				navigate('/home');
			}
		}

		return  () => { dataLoaded.current = true; }
	}, [navigate, token]);

	if (!token) {
		return <></>;
	}

	return (
		<>
			<div className="container-fluid d-flex flex-column min-h-100-vh">
				<div className="row" id="navigation-bar">
					<NavBarLazy />
				</div>

				<div className="row flex-fill">
					<div className="col-md-2 bg-white pr-0">
						<SidePanelLazy />
					</div>

					<div className="col-md-10 bg-grey" id="main-content-area">
						<div className="container-fluid p-4">
							<Routes>
								<Route index element={<Navigate to="/app/dashboard" />} />
								<Route path="dashboard" element={<DashboardLazy />} />
								<Route path="expenses/*" element={<ExpensesLazy />} />
								<Route path="groups/*" element={<GroupsLazy />} />
								<Route path="friends/*" element={<FriendsLazy />} />
								<Route path="activity" element={<ActivityLazy />} />
								<Route path="settings" element={<SettingsLazy />} />
								<Route path="*" element={<Navigate to="/app/dashboard" />} />
							</Routes>
						</div>
					</div>
				</div>
			</div>

		</>
	)
}

export default HomeComponent;
