import React, { ChangeEvent, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import UserGetResponse from '../../service/api-service/schema/response/UserGetResponse';
import FriendsService from '../../service/api-service/friends-service';
import { Grid } from '@mui/material';
import { right } from '@popperjs/core';

const FriendsAddComponent: React.FC = () => {
    const [suggestions, setSuggestions] = useState<UserGetResponse[]>([]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        // Add logic to handle input change
        console.log("Value: ", event.target.value);
        getAllFriends();
        
    }

    //  Call Friends API to get the friends list
    const getAllFriends = async() => {
        // Add logic to get all friends
        const result = await FriendsService.get();
        console.log(result);
        
        setSuggestions(result);
    }

    return (
      <Autocomplete
        options={suggestions.map((option) => option.username)}
        style={{ width: 800, marginBottom: 20 } }
        renderInput={(params) => (
          <Grid>
            <Grid item alignItems='right'>
              <TextField
                {...params}
                label="Search Users"
                variant="outlined"
                onChange={(event) => handleInputChange(event)} // Add logic to handle input change
              />
            </Grid>
          </Grid>
        )}
      />
    );
};

export default FriendsAddComponent;
