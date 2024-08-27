import { Typography, Button, List, ListItem, ListItemText, Divider, Avatar, CardContent, Card, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

interface User {
    id: string;
    name: string;
    avatar: string;
    amountOwed: number;
}

const FriendsCard: React.FC<User> = (user) => {
    return (
      <div>
        <Grid container spacing={2}>
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
                component={Link}
                to={`/app/groups/${user.id}`}
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
                    {user.name}
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
        </Grid>
      </div>
    );
}

export default FriendsCard;