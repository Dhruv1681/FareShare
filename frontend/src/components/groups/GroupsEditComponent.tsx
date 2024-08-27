import { Typography, Grid, Box, TextField, Autocomplete, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch, Button} from '@mui/material';
import { useEffect, useState } from 'react';
import GroupService from '../../service/api-service/group-service';
import { useNavigate, useParams } from 'react-router-dom';
import GroupGetResponse from '../../service/api-service/schema/response/GroupGetResponse';
import UserGetResponse from '../../service/api-service/schema/response/UserGetResponse';
import FriendsService from '../../service/api-service/friends-service';

const GroupsEditComponent: React.FC = () => {
    const { groupId } = useParams<string>();
    const [formData, setFormData] = useState<GroupGetResponse>({
        id: "",
        name: "",
        members: [],
        image: "",
        category: "",
        simplifiedDebt: false,
    });
    const [friends, setFriends] = useState<UserGetResponse[]>([]);

    useEffect(() => {
        // Call Friends API to get the friends list
        const getAllFriends = async () => {
            const result = await FriendsService.get();
            setFriends(result);
        }
        getAllFriends();

        // Call Get Group API to get the group details by group id
        const getGroupById = async () => {
            const result = await GroupService.findById(groupId || '');
            setFormData(result);
        }
        getGroupById();
    }, []);

    const navigate = useNavigate();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevData) => ({ ...prevData, simplifiedDebt: event.target.checked }));
    };

    const handleGroupMembersChange = (newValue: any) => {
         // Update the 'members' property in the formData
            setFormData((prevData) => ({
              ...prevData,
              members: newValue,
            }));
    };

    const handleGroupTypeChange = (event: any) => {
        setFormData((prevData) => ({
          ...prevData,
          category: event.target.value as string,
        }));
    };

    const handleGroupNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setFormData((prevData) => ({ ...prevData, name: value }));
    };

    const handleClose = () => {
      // Implement your cancel logic here
      console.log("Cancel button clicked");

      // Reset the form data
      setFormData({
        id: "",
        name: "",
        members: [],
        image: "",
        category: "",
        simplifiedDebt: false,
      });

      // Navigate to the groups lists page
      navigate(`/app/groups/${groupId}`);
    };

    const handleSubmit = () => {
      // Implement your form submission logic here
      console.log("Form submitted with values:", {
        formData,
      });

      // Update the group and navigate to the groups details page
      
      navigate(`/app/groups/${groupId}`);
    };

    return (
      <div>
        {/* Header Box for Edit Group */}
        <Box bgcolor="#f8f8f8" p={2} borderRadius={4} marginBottom={2}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h4">Edit Group</Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Main Box for Edit Group Form */}
        <Box bgcolor="#ffffff" p={2} borderRadius={4} marginBottom={2}>
          <TextField
            label="Group Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData?.name || ''}
            onChange={handleGroupNameChange}
          />

          {/* Autocomplete for Group Members */}
          <Autocomplete
            multiple
            id="group-members"
            options={friends}
            //value={formData.members.map((member) => {member.id, member.name})}
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

           {/* Select Box for Group Type */}     
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel id="group-type-label">Group Type</InputLabel>
            <Select
              label="Group Type"
              labelId="group-type-label"
              id="group-type"
              value={formData?.category}
              onChange={handleGroupTypeChange}
            >
              <MenuItem value="Type 1">Home</MenuItem>
              <MenuItem value="Type 2">Trip</MenuItem>
              <MenuItem value="Type 3">Couple</MenuItem>
              <MenuItem value="Type 3">Other</MenuItem>
            </Select>
          </FormControl>

        {/* Switch for Simplified Debt */}
          <FormControlLabel
            control={
              <Switch
                checked={formData?.simplifiedDebt}
                onChange={handleChange}
                color="primary"
                value="dynamic-class-name"
              />
            }
            label="Simplified Debt"
          />

            {/* Buttons for Save and Cancel */}
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
}

export default GroupsEditComponent;