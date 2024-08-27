import { Typography, Grid, Button, Box, Container, TextField } from '@mui/material';
import { SetStateAction, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel
} from "@mui/material";
import Switch from '@mui/material/Switch';
import React from 'react';
import GroupService from '../../service/api-service/group-service';
import GroupSaveRequest from '../../service/api-service/schema/request/GroupSaveRequest';
import FriendsService from '../../service/api-service/friends-service';

const GroupsAddComponent: React.FC = () => {
    const [friends, setFriends] = useState<any[]>([]);
    useEffect(() => {
      // Call Friends API to get the friends list
      const getAllFriends = async () => {
        const result = await FriendsService.get();
        setFriends(result);
      };
      // Call the getAllFriends function
      getAllFriends();
    }, []); 

    // setFormData is a function that will update the formData state
  const [formData, setFormData] = useState<GroupSaveRequest>({
    name: '',
    members: [],
    type: '',
    simplifiedDebt: false,
  });

  // Navigate hook
  const navigate = useNavigate();


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({ ...prevData, simplifiedDebt: event.target.checked }));
  };

  // Handle change for the group members
  const handleGroupMembersChange = (newValue: any) => {
    setFormData((prevData) => ({ ...prevData, members: newValue }));
  };

  // Handle change for the group type
  const handleGroupTypeChange = (event: any) => {
    //setGroupType(event.target.value);
    const { value } = event.target;
    setFormData((prevData) => ({ ...prevData, type: value }));
  };

  // Handle change for the group name
  const handleGroupNameChange = (event: any) => {
    //setGroupName(event.target.value);
    const { value } = event.target;
    setFormData((prevData) => ({ ...prevData, name: value }));
  }

  // Handle close for the cancel button
  const handleClose = () => {
    // Implement your cancel logic here
    console.log("Cancel button clicked");

    // Reset the form data
    setFormData(
        {
            name: '',
            members: [],
            type: '',
            simplifiedDebt: false,
        }
    )

    // Navigate to the groups lists page
    navigate("/app/groups");
  }

  // Handle submit for the save button
  const handleSubmit = () => {
    // Implement your form submission logic here
    console.log("Form submitted with values:", {
      formData
    });


    // Save the group and navigate to the groups lists page
    const result = GroupService.save(formData);
    navigate("/app/groups");
  };

    return (
        // Form to add a group
      <div>
        {/* Header Box */}
        <Box bgcolor="#f8f8f8" p={2} borderRadius={4} marginBottom={2}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h4">Add Group</Typography>
            </Grid>
            <Grid item>
              <Link
                to="/app/groups/add"
                style={{ textDecoration: "none" }}
              ></Link>
            </Grid>
          </Grid>
        </Box>

        {/* Main Content Box */}
        <Box bgcolor="#ffffff" p={2} borderRadius={4} marginBottom={2}>
          <TextField
            label="Group Name"
            variant="outlined"
            fullWidth
            margin="normal"
            //value={formData.name}
            onChange={handleGroupNameChange}
          />

        {/* Autocomplete for Group Members */}
          <Autocomplete
            multiple
            id="group-members"
            options={["Member 1", "Member 2", "Member 3", "Member 4"]}
            value={formData.members.map((member) => member.id)}
            onChange={handleGroupMembersChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Group Members"
                variant="outlined"
                fullWidth
                margin="normal"
              />
            )}
          />

        {/* Select for Group Type */}
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel id="group-type-label">Group Type</InputLabel>
            <Select
              label="Group Type"
              labelId="group-type-label"
              id="group-type"
              value={formData.type}
              onChange={handleGroupTypeChange}
            >
              <MenuItem value="Type 1">Home</MenuItem>
              <MenuItem value="Type 2">Trip</MenuItem>
              <MenuItem value="Type 3">Couple</MenuItem>
              <MenuItem value="Type 3">Other</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={formData.simplifiedDebt}
                onChange={handleChange}
                color="primary"
                value="dynamic-class-name"
              />
            }
            label="Simplified Debt"
          />

            {/* Buttons with Save and Cancel */}
          <Grid container spacing={2} justifyContent="flex-end">
            <Grid item>
              <Button
                variant="contained"
                style={{ backgroundColor: "#32c29f" }}
                onClick={handleSubmit}
              >
                Save
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="error" onClick={handleClose}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </div>
    );
};

export default GroupsAddComponent;
