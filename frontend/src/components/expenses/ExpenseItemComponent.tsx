import React from 'react';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ListItem } from '@mui/material';
import ExpenseResponse from '../../service/api-service/schema/response/ExpenseResponse';

import { MAP } from '../../constants/expense-categories-map';
import { useNavigate } from 'react-router-dom';

interface ExpenseItemProps {
    expense: ExpenseResponse;
    editCallback: (expense: ExpenseResponse) => void;
    deleteCallback: (expense: ExpenseResponse) => void;
}

const ExpenseItemComponent: React.FC<ExpenseItemProps> = ({ expense, deleteCallback, editCallback }) => {
    const deleteClicked = () => {
        console.log("Delete clicked for expense: ", expense);
        deleteCallback(expense);
    }

    const editClicked = () => {
        console.log("Delete clicked for expense: ", expense);
        editCallback(expense)
    }

    return (
        <>
          <Box
            border={1}
            borderRadius={4}
            marginBottom={2}
            borderColor="grey.300"
            style={{ backgroundColor: "#ffffff" }}
          >
            <ListItem key={expense.id}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={1}>
                  <Box textAlign="center">
                    <Typography variant="subtitle2">
                      {expense.extraData.monthText}
                    </Typography>
                    <Typography variant="h6">
                      {expense.extraData.dateText}
                    </Typography>
                  </Box>
                </Grid>
      
                <Grid item xs={12} md={1}>
                  <Box textAlign="center">
                    <img
                      src={`/assets/expense-category-icons/${MAP[expense.category]}`}
                      alt="Icon"
                      style={{ margin: '0 2rem', maxWidth: '70%', borderRadius: 15}}
                    />
                  </Box>
                </Grid>
      
                <Grid item xs={12} md={1}>
                  <Box textAlign="center"></Box>
                </Grid>
      
                <Grid item xs={12} md={5}>
                  <Box justifyContent="flex-end">
                    <Typography variant="h6">
                      {expense.description}
                    </Typography>
                    <Typography variant="subtitle2">
                      {expense.extraData.paidByText}
                    </Typography>
                  </Box>
                </Grid>
      
                <Grid item xs={12} md={2}>
                  <Box>
                    <Box display="flex" color={expense.extraData.fontColor}>
                      <Box>
                        <Typography variant="subtitle2">
                          {expense.extraData.shareText}
                        </Typography>
                        <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                          {expense.extraData.amountText}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
      
                <Grid item xs={12} md={2}>
                  <Box>
                    <Box display="flex">
                      <IconButton color="primary" onClick={editClicked}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="primary" onClick={deleteClicked}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </ListItem>
          </Box>
        </>
      );
      
};

export default ExpenseItemComponent;
