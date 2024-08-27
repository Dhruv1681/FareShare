import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Typography, Grid, Button, Box, List, ListItemText, ListItem, Card, CardContent, Container, backdropClasses} from '@mui/material';
import ActivityService from '../../service/api-service/activity-service';
import Activity from '../../service/api-service/schema/response/ActivityResponse';
import { setActivityActivity } from '../../state/slice/activity-slice';
import { AppDispatch } from '../../state/store/store';
import { Link } from 'react-router-dom';
import { useCallback } from 'react';

const colorClasses = (color: string) => {
  switch (color) {
    case 'red':
      return 'text-danger';
    case 'green':
      return 'text-success';
    case 'grey':
      return 'text-muted';
    default:
      return '';
  }
};

const ActivityComponent: React.FC = () => {
  const dataLoaded = useRef(false);

  const dispatch = useDispatch<AppDispatch>();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);
  const pageSize = 5;

  const fetchActivities = useCallback(async () => {
    try {
      const queryParams = { 
				page: page, 
				size: pageSize, 
			};
      const response = await ActivityService.get(queryParams);
      console.log("Data: ", response.meta.totalPages);
      setActivities((prevActivities) => [...prevActivities, ...response.data]);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  }, [page]);

  useEffect(() => {
    if (dataLoaded.current || process.env.NODE_ENV !== 'development') {
      fetchActivities();
      dispatch(setActivityActivity());
    }

    return () => { dataLoaded.current = true; }
  }, [fetchActivities]);

  const renderActivityDescription = (activity: Activity) => {
    const textWithSpaces = activity.textData.map((data) => {
      const fontWeight = data.bold ? 'bold' : 'normal';
      return (
        <span style={{ fontWeight }} key={data.text}>
          {`${data.text} `}
        </span>
      );
    });

    const textColorClass = colorClasses(activity.textColor);

    return (
      <div>
        <p className="mb-1">{textWithSpaces}</p>
        <p className="text-muted">{activity.createdOn}</p>
        <p>
          {textColorClass 
            && 
            <p className={textColorClass}>
              {activity.text}
            </p>
          }
        </p>
      </div>
    );
  };

  const handleLoadMore = () => {
    console.log("In Handle More");
		if (page < totalPages) {
			setPage((prevPage) => prevPage + 1);
		}
	};


  return (
    <>
      <Box bgcolor="#f8f8f8" p={2} borderRadius={4} marginBottom={2}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h4">Activity</Typography>
          </Grid>
        </Grid>
      </Box>
      
      <List style={{ marginBottom: "16px" }}>
        {activities.map((activity) => (
          <Box
            key={activity.id}
            border={1}
            borderRadius={4}
            borderColor="grey.300"
            marginBottom={2}
            style={{ backgroundColor: "#ffffff" }}
          >
            <ListItem key={activity.id}>
              {renderActivityDescription(activity)}
            </ListItem>
          </Box>
        ))}
      </List>

      {page < totalPages && (
        <Button
          onClick={handleLoadMore}
          variant="contained"
          color="primary"
          fullWidth
        >
          Load More
        </Button>
      )}  
    </>
  );
};

export default ActivityComponent;
