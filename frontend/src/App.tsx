import { Suspense, lazy, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { setToken } from './state/slice/auth-slice';
import { AppDispatch, RootState } from './state/store/store';
import { fetchUser, setLoading } from './state/slice/user-slice';

import ApiLoadingComponent from './components/api-loading/ApiLoadingComponent';
import LoadingComponent from './components/loading/LoadingComponent';
import LocalStorageService from './service/local-storage-service';

import './scss/main.scss';

const LandingPageLazy = lazy(() => import('./components/landing-page/LandingPageComponent'));
const HomeLazy = lazy(() => import('./components/home/HomeComponent'));
const ToastLazy = lazy(() => import('./components/toast/ToastComponent'));

const App = () => {
    const dataLoaded = useRef(false);

	const dispatch = useDispatch<AppDispatch>();
	const loading = useSelector((state: RootState) => state.userReducer.loading);
	console.log('loading', loading);

	useEffect(() => {
		if (dataLoaded.current || process.env.NODE_ENV !== 'development') {
			const storedToken = LocalStorageService.getStoredToken();
			if (storedToken) {
				dispatch(setToken(storedToken));
				dispatch(fetchUser());
			} else {
				dispatch(setLoading(false));
			}
		}

		return  () => { dataLoaded.current = true; }
	}, [dispatch]);

	if (loading) {
		return  <LoadingComponent />;
	}

	return (
		<Router>
			<ApiLoadingComponent />

			<Suspense fallback={<LoadingComponent />}>
				<ToastLazy />

				<Routes>
					<Route index element={<Navigate to="/home" />} />
					<Route path="/home/*" element={<LandingPageLazy />} />
					<Route path="/app/*" element={<HomeLazy />} />
					<Route path="*" element={<Navigate to="/home" />} />
				</Routes>
			</Suspense>
		</Router>
	);
}

export default App;
