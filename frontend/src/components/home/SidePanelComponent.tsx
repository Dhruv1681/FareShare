import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../../state/store/store";
import { setActivity } from "../../state/slice/activity-slice";

const SidePanelComponent = () => {
	const { t } = useTranslation();

	const activeActivity = useSelector((state: RootState) => state.activityReducer.name);
	const dispatch = useDispatch<AppDispatch>();

	const [hoveredLink, setHoveredLink] = useState('');

	const handleItemClick = (activity: string) => {
		dispatch(setActivity(activity));
		console.log('activeActivity:', activeActivity);
	};

	const menuItems = [
		{
			key: 'dashboard',
			icon: 'dashboard',
			hoverIcon: 'dashboard-green', 
			path: '/app/dashboard',
			activity: 'dashboard'
		},
		{
			key: 'expenses',
			icon: 'expenses',
			hoverIcon: 'expenses-green',
			path: '/app/expenses',
			activity: 'expenses'
		},
		{
			key: 'groups',
			icon: 'groups',
			hoverIcon: 'groups-green',
			path: '/app/groups',
			activity: 'groups'
		},
		{
			key: 'friends',
			icon: 'friends',
			hoverIcon: 'friends-green',
			path: '/app/friends',
			activity: 'friends'
		},
		{
			key: 'activity',
			icon: 'activity',
			hoverIcon: 'activity-green',
			path: '/app/activity',
			activity: 'activity'
		},
		{
			key: 'settings',
			icon: 'settings',
			hoverIcon: 'settings-green',
			path: '/app/settings',
			activity: 'settings'
		},
	];

	return (

		<div className="text-left">
			{menuItems.map((item, index) => (
				<Link
					key={index}
					to={item.path}
					onClick={() => handleItemClick(item.activity)}
					onMouseEnter={() => setHoveredLink(item.path)}
					onMouseLeave={() => setHoveredLink('')}
					className={`${activeActivity === item.activity ? 'color-green' : 'color-dark-grey'} d-block text-decoration-none font-bold side-panel-font text-hover-green text-left my-5`} >

					<div className={`d-flex align-items-center ${activeActivity === item.activity ? 'sidebar-active' : ''}`}>
						<div className="d-flex align-items-center">
							{hoveredLink === item.path || activeActivity === item.activity ? (
								<div className={`d-inline-block icon-${item.hoverIcon}`}></div>							
							) : (
								<div className={`d-inline-block icon-${item.icon}`}></div>
							)}

							<div className="d-inline-block ml-4">
								{t(item.key)}
							</div>
						</div>

						{activeActivity === item.activity && (
							<div className="ml-auto">
								<div className="vertical-bar bg-green"></div>
							</div>
						)}
					</div>

				</Link>
			))}
		</div>
	)
}

export default SidePanelComponent;
