import React, { useEffect, useState } from 'react';
import { Typography, Grid, Button, Box, List, ListItemText, ListItem, Card, CardContent} from '@mui/material';
import { Link } from 'react-router-dom';
import UserGetResponse from '../../service/api-service/schema/response/UserGetResponse';
import UserService from '../../service/api-service/user-service';

const FriendsListComponent: React.FC = () => {
    const [users, setUsers] = useState<UserGetResponse[]>([]);

    useEffect(() => {
      // Call Users API to get the users list
      const getAllUsers = async () => {
        const result = await UserService.search();
        setUsers(result);
      }

      getAllUsers();
    }, []);

    return (
        <div>
        <Box bgcolor="#f8f8f8" p={2} borderRadius={4} marginBottom={2}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h4">Friends</Typography>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={2}>
          {users.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.id}>
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
                <ListItem
                  style={{
                    textDecoration: "none",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "16px",
                    height: "100%", // Make the ListItem take up full height
                  }}
                >
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
                      {user.firstname}
                    </Typography>
                  </CardContent>
                </ListItem>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    );
}

export default FriendsListComponent;