import React, { useEffect, useRef } from 'react';
import { Typography, Button} from '@mui/material';
import { Navigate, Route, Routes } from 'react-router-dom';
import FriendsListComponent from './FriendsListComponent';
import FriendsAddComponent from './FriendsAddComponent';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../state/store/store';
import { setFriendsActivity } from '../../state/slice/activity-slice';

const FriendsComponent: React.FC = () => {
    const dataLoaded = useRef(false);

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
      if (dataLoaded.current || process.env.NODE_ENV !== 'development') {
        dispatch(setFriendsActivity());
      }

      return () => { dataLoaded.current = true; }
    }, []);

    const handleAddFriendClick = () => {
        // Perform any additional logic if needed
        // For now, let's assume you want to navigate to "/new-friend" when the button is clicked
    };

    return (
      // <div style={{ backgroundColor: "#f0f0f0", padding: "16px" }}>
      //   <div
      //     style={{
      //       display: "flex",
      //       justifyContent: "space-between",
      //       alignItems: "center",
      //     }}
      //   >
      //     <Typography variant="h4">Friends</Typography>
      //     <FriendsAddComponent />
      //     <Button
      //         variant="contained"
      //         color="primary"
      //         onClick={handleAddFriendClick}
      //         style={{ marginRight: "25px" }}
      //       >
      //         Add Friend
      //       </Button>
      //   </div>
      <div>
        <Routes>
          <Route index element={<FriendsListComponent />} />
          <Route path="/add" element={<FriendsAddComponent />} />
          <Route path="*" element={<Navigate to="/app/friends" />} />
        </Routes>
      </div>
    );
};

export default FriendsComponent;
