import { Box, Button, FormControlLabel, Grid, Paper, Switch, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { RootState } from "../../state/store/store";
import { useSelector } from "react-redux";
import UserService from "../../service/api-service/user-service";
import UserGetResponse from "../../service/api-service/schema/response/UserGetResponse";
import { useNavigate } from "react-router";
import ToastService from "../../service/toast-service";

const SettingsComponent = () => {
    // Get User ID from Redux store
    const userId = useSelector((state: RootState) => state.userReducer.id);

    // Navigate Hook
    const navigate = useNavigate();

    // Ref to check if the data is loaded
    const dataLoaded = useRef(false);

    const { t } = useTranslation(); // Use the useTranslation hook to get the t function from i18n

    useEffect(() => {
        // Call User API to get user using user id
        if (dataLoaded.current || process.env.NODE_ENV !== 'development') {
            const getuserById = async () => {
              try {
                // Call API to get user by id
                const result = await UserService.findById(userId);
                // Set user data in the form
                setFormData(result);
              } catch (err) {
                ToastService.handleError(err);
                console.log(err);
              }
            };
            getuserById();
        }
    
        return () => { dataLoaded.current = true; }
    }, []);

    // Default Form Data
    const [formData, setFormData] = useState<UserGetResponse>({
        id: '',
        firstname: '',
        lastname: '',
        fullname: '',
        username: '',
        email: '',
        nickname: '',
        preferences: {
            receiveExpenseAddedNotification: false,
            receiveExpenseEditedDeletedNotification: false,
            receiveGroupInvitationNotification: false,
            receiveFriendRequestNotification: false,
            receiveExpenseCommentNotification: false,
        }
      });

      // Function to check user first name event change
      const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevData) => ({
          ...prevData,
          firstname: event.target.value,
        }));
      }

      // Function to check user last name event change
      const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevData) => ({
          ...prevData,
          lastname: event.target.value,
        }));
      }

      // Function to check user email event change
      const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevData) => ({
          ...prevData,
          email: event.target.value,
        }));
      }

      // Function to check user nick name event change
      const handleNickNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevData) => ({
          ...prevData,
          nickname: event.target.value,
        }));
      }
    
      // Check if the user wants to receive expense added notification
      const handleExpenseAddChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevData) => ({
          ...prevData,
          preferences: {
            ...prevData.preferences,
            receiveExpenseAddedNotification: event.target.checked,
          },
        }));
      }

      // Check if the user wants to receive expense edited or deleted notification
      const handleExpenseUpdateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevData) => ({
          ...prevData,
          preferences: {
            ...prevData,
            receiveExpenseEditedDeletedNotification: event.target.checked,
          },
        }));
      }

      // Handle submit for the save button
      const handleSubmit = async(e: any) => {
        e.preventDefault();
        console.log('Form submitted with data:', formData);
        // Update the user settings and stay on the same page with the updated data and a toast message
        try{
            console.log("Form Data: ", formData);
            // Update the user settings
            const data = await UserService.update(formData);
            ToastService.handleSuccess("User settings updated successfully");
            console.log("Data: ", data);
        } catch (err) {
            ToastService.handleError(err);
            console.log("Error: ", err);
        }
        
      };

      // Handle close for the cancel button
      const handleClose = () => {
        // Implement your cancel logic here
        console.log("Cancel button clicked");
    
        // Reset the form data
        setFormData({
            id: '',
            firstname: '',
            lastname: '',
            fullname: '',
            username: '',
            email: '',
            nickname: '',
            preferences: {
                receiveExpenseAddedNotification: false,
                receiveExpenseEditedDeletedNotification: false,
                receiveGroupInvitationNotification: false,
                receiveFriendRequestNotification: false,
                receiveExpenseCommentNotification: false,
            }
        });
    
        // Navigate to the last visited page
        navigate(-1);
      }

      // JSX structure with MUI components
    return (
      <div>
        <Box bgcolor="#f8f8f8" p={2} borderRadius={4} marginBottom={2}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h4">{t('userSettings')}</Typography>
            </Grid>
          </Grid>
        </Box>

         {/* Form container */}
        <Box bgcolor="#ffffff" p={2} borderRadius={4} marginBottom={2}>
            {/* Text Field to get user first name */}
          <TextField
            label={t('firstName')}
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.firstname}
            onChange={handleFirstNameChange}
          />

            {/* Text Field to get user last Name */}
          <TextField
            label={t('lastName')}
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.lastname}
            onChange={handleLastNameChange}
          />

        {/* Text Field to get user email */}
          <TextField
            label={t('userEmail')}
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleEmailChange}
          />

        {/* Text to get user nickname */}
          <TextField
            label={t('nickName')}
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.nickname}
            onChange={handleNickNameChange}
          />

        {/*  Checkboxes to get user preferences */}
          <FormControlLabel
            control={
              <Switch
                onChange={handleExpenseAddChange}
                color="primary"
                checked={formData.preferences?.receiveExpenseAddedNotification || false}
                value={formData.preferences?.receiveExpenseAddedNotification || false}
              />
            }
            label={t('expenseAddedNotifications')}
          />

          <FormControlLabel
            control={
              <Switch
                onChange={handleExpenseUpdateChange}
                color="primary"
                checked={formData.preferences?.receiveExpenseEditedDeletedNotification || false}
                value={formData.preferences?.receiveExpenseEditedDeletedNotification || false}
              />
            }
            label={t('expenseUpdateNotifications')}
          />

          {/* Buttons with Save and Cancel */}
          <Grid container spacing={2} justifyContent="flex-end">
            <Grid item>
              <Button
                variant="contained"
                style={{ backgroundColor: "#32c29f" }}
                onClick={handleSubmit}
              >
                {t('save')}
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="error" onClick={handleClose}>
              {t('cancel')}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </div>
    );
}

export default SettingsComponent;