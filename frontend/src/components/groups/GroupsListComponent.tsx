import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Grid, Button, Box, List, ListItemText, ListItem, Card, CardContent} from '@mui/material';
import GroupService from '../../service/api-service/group-service';
import GroupGetResponse from '../../service/api-service/schema/response/GroupGetResponse';

const GroupsListComponent: React.FC = () => {
    // Set the groups state
    const [groups, setGroups] = useState<GroupGetResponse[]>([]);

    useEffect(() => {
      // function to get all groups
      const getAllGroups = async () => {
        // Call Group API to get the groups list
        const result = await GroupService.find();
        
        console.log(result);
        setGroups(result);
      }
      // Call the getAllGroups function
      getAllGroups();
    }, []);

    return (
      <div>
        {/* Header Box for Groups */}
        <Box bgcolor="#f8f8f8" p={2} borderRadius={4} marginBottom={2}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h4">Groups</Typography>
            </Grid>
            <Grid item>
              <Link to="/app/groups/add" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  style={{ marginRight: "20px", backgroundColor: "#32c29f" }}
                >
                  Add Group
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Box>

        {/* Grid container for displaying groups */}
        <Grid container spacing={2}>
          {groups.map((group) => (
            <Grid item xs={12} sm={6} md={4} key={group.id}>
                {/* Card for displaying group information */}
              <Card
                variant="outlined"
                style={{
                  marginBottom: "16px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  cursor: "pointer",
                  height: "200px", // Adjust the height as needed
                }}
              >
                 {/* ListItem for group details */}
                <ListItem
                  component={Link}
                  to={`/app/groups/${group.id}`}
                  style={{
                    textDecoration: "none",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "16px",
                    height: "100%", // Make the ListItem take up full height
                  }}
                >
                    {/* CardContent for displaying group name */}
                  <CardContent style={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      component="div"
                      style={{
                        fontSize: "36px",
                        color: "#32c29f",
                        textDecoration: "none",
                        transition: "text-decoration 0.3s ease",
                      }}
                    >
                      {group.name}
                    </Typography>
                  </CardContent>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      style={{ marginRight: "8px" }}
                    >
                      View Details
                    </Typography>
                  </div>
                </ListItem>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    );
};
export default GroupsListComponent;
