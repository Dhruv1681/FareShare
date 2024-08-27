import { useState, useRef, useEffect } from 'react';
import { Typography, Grid, Button, Box, TextField, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ExpenseRequest from '../../service/api-service/schema/request/ExpenseSaveRequest';
import { EXPENSE_CATEGORIES } from '../../constants/constants';
import { useNavigate, useParams } from 'react-router-dom';
import UserGetResponse from '../../service/api-service/schema/response/UserGetResponse';
import UserService from '../../service/api-service/user-service';
import ExpenseUserListComponent from './ExpenseUserListComponent';
import ExpenseService from '../../service/api-service/expense-service';
import ToastService from '../../service/toast-service';

const SaveExpenseComponent = () => {
  const navigate = useNavigate();

  const dataLoaded = useRef(false);

  const { t } = useTranslation();

  const { category, id, action } = useParams();

  const [formData, setFormData] = useState<ExpenseRequest>({
    description: '',
    amount: 0,
    date: '',
    category: '',
    groupId: '',
    paidBy: '',
    split: {
      type: 'equal',
      payload: {}
    },
  });

  const [users, setUsers] = useState<UserGetResponse[]>([]);

  let usernames: string[] = [];
  let splitState: { [key: string]: number } = {};

  const fetchUsers = async () => {
    try {
      const data = await UserService.search();
      setUsers(data);
    } catch (error) {
      console.log("Error in savve expense fetch users", error);
    }
  }

  const checkEditExpense = async () => {
    if (action === 'edit' && id && id !== 'new') {
      try {
        const expense = await ExpenseService.findById(id);
        console.log('edit Expense: ', expense);

        const dateString = "2023-12-30T00:00:00.000Z";
        const dateObject = new Date(dateString);
        const formattedDateString = dateObject.toISOString().split('T')[0];
        const state = {
          description: expense.description,
          amount: expense.amount,
          date: formattedDateString,
          category: expense.category,
          groupId: expense.groupId,
          paidBy: expense.paidBy,
          split: {
            type: expense.split.type,
            payload: {}
          },
        }

        setFormData(state);

      } catch (error) {
        console.log("Error in save expense check edit expense", error);
        ToastService.handleError(error);
      }
    }
  }

  useEffect(() => {
		if (dataLoaded.current || process.env.NODE_ENV !== 'development') {
			fetchUsers();
      checkEditExpense();
		}

		return  () => { dataLoaded.current = true; }
	}, []);

  const arrayStateChanged = (usernameList: string[]) => {
    console.log('Array State Changed:', usernameList);
    // setUsernames(username);
    usernames = usernameList;
  }

  const mapStateChanged = (state: { [key: string]: number }) => {
    console.log('Map State Changed:', state);
    // setSplitState(state);
    splitState = state;
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const newValue = name === 'amount' ? Number(value) : value;
    setFormData((prevData) => ({ ...prevData, [name]: newValue }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    if (name === 'splitType') {
      setFormData((prevData) => ({ ...prevData, split: { ...prevData.split, type: value } }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name as string]: value }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Form Data:', formData, 'Split State:', splitState, 'Usernames:', usernames);
    
    const payload = (formData.split.type === 'equal' || formData.split.type === "reimbursement") 
      ? usernames 
      : splitState;

    const expenseRequest: ExpenseRequest = { ...formData };
    expenseRequest.split.payload = payload as any;

    if (category === 'group' && id) {
      expenseRequest.groupId = id as string;
    }

    console.log('Expense Request:', expenseRequest);

    try {
      let response;
      if (action === 'edit') {
        console.log('Editing Expense:', id);
        response = await ExpenseService.put(id as string, expenseRequest);
      } else {
        console.log('Adding Expense:', id);
        response = await ExpenseService.post(expenseRequest);
      }

      console.log('Save Expense Response:', response);
      ToastService.handleSuccess(t('expenseSaved'));
      navigate(-1);
    } catch (error) {
      console.log('Error in SaveExpenseComponent:', error);
      ToastService.handleError(error);
    }
    
  };

  const handleClose = () => {
    // use navigate to back
    navigate(-1);
  }

  return (
    <div>
      <Box bgcolor="#ffffff" p={2} borderRadius={4} mb={2}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h4">{t('addExpense')}</Typography>
          </Grid>

        </Grid>
      </Box>

      <Box bgcolor="#ffffff" p={2} borderRadius={4}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} >
              {/* Expense Name */}
              <Grid item xs={12} mb={4}>
                <TextField
                  label={t('expenseName')}
                  variant="outlined"
                  fullWidth
                  name="description"
                    value={formData.description}
                  onChange={handleInputChange}
                />
              </Grid>

              {/* Amount */}
              <Grid item xs={12} mb={3}>
                <TextField
                  label={t('amount')}
                  variant="outlined"
                  fullWidth
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                />
              </Grid>

              {/* Date */}
              <Grid item xs={12} mb={3}>
                <TextField
                  label={t('date')}
                  variant="outlined"
                  fullWidth
                  type="date"
                  name="date"
                  value={formData.date}
                  InputLabelProps={{ shrink: true }}
                  onChange={handleInputChange}
                />
              </Grid>

              {/* Category */}
              <Grid item xs={12} mb={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>{t('category')}</InputLabel>
                  <Select
                    label={t('category')}
                    name="category"
                    value={formData.category}
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="">{t('selectCategory')}</MenuItem>
                    {Object.values(EXPENSE_CATEGORIES).map((categoryKey) => (
                      <MenuItem key={categoryKey} value={categoryKey}>
                        {t(categoryKey)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Paid By */}
              <Grid item xs={12} mb={3}>
                <TextField
                  label={t('paidBy')}
                  variant="outlined"
                  fullWidth
                  name="paidBy"
                  value={formData.paidBy}
                  onChange={handleInputChange}
                />
              </Grid>

              {/* Split Type */}
              <Grid item xs={12} mb={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>{t('splitType')}</InputLabel>
                  <Select
                    label={t('splitType')}
                    name="splitType"
                    value={formData.split.type}
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="equal">{t('equal')}</MenuItem>
                    <MenuItem value="unequal">{t('unequal')}</MenuItem>
                    <MenuItem value="percentage">{t('percentage')}</MenuItem>
                    <MenuItem value="shares">{t('shares')}</MenuItem>
                    <MenuItem value="reimbursement">{t('reimbursement')}</MenuItem>
                    {/* <MenuItem value="settlement">{t('settlement')}</MenuItem> */}
                    {/* <MenuItem value="itemized">{t('itemized')}</MenuItem> */}
                  </Select>
                </FormControl>
              </Grid>


            </Grid>
            <Grid item xs={12} sm={6}>
              {/* Placeholder for user list */}
              {/* <Box bgcolor="#f8f8f8" p={2} borderRadius={4} height="90vh" overflowY="auto"> */}
              {/* <Typography variant="body1">User List Placeholder</Typography> */}

              <ExpenseUserListComponent 
                users={users} 
                splitType={formData.split.type} 
                amount={formData.amount} 
                arrayStateChanged={arrayStateChanged}
                mapStateChanged={mapStateChanged} />

              {/* Submit and cancel button */}
              <Grid container mt={2} spacing={2} justifyContent="flex-end">
                <Grid item>
                  <Button type="submit" variant="contained" style={{ backgroundColor: "#32c29f" }}>
                    {t('save')}
                  </Button>
                </Grid>

                <Grid item>
                  <Button variant="contained" color="error" onClick={handleClose}>
                    {t('cancel')}
                  </Button>
                </Grid>
              </Grid>
            </Grid>


          </Grid>
        </form>

      </Box>
    </div>
  );
}

export default SaveExpenseComponent;