import React, { useEffect, useRef } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import GroupsListComponent from './GroupsListComponent';
import GroupsAddComponent from './GroupsAddComponent';
import GroupsEditComponent from './GroupsEditComponent';
import GroupsDetailsComponent from './GroupsDetailsComponent';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../state/store/store';
import { setGroupsActivity } from '../../state/slice/activity-slice';

const GroupsComponent: React.FC = () => {
  const dataLoaded = useRef(false);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (dataLoaded.current || process.env.NODE_ENV !== 'development') {
      dispatch(setGroupsActivity());
    }

    return () => { dataLoaded.current = true; }
  }, []);

  return (
    <div>
      <Routes>
        <Route index element={<GroupsListComponent />} />
        <Route path="/add" element={<GroupsAddComponent />} />
        <Route path="/:groupId/edit" element={<GroupsEditComponent />} />
        <Route path="/:groupId" element={<GroupsDetailsComponent />} />
        <Route path="*" element={<Navigate to="/app/groups" />} />
      </Routes>
    </div>
  );



};

export default GroupsComponent;

