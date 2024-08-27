import { Link, useNavigate, useParams } from 'react-router-dom';
import { Typography, Grid, Button, Box, List} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import GroupService from '../../service/api-service/group-service';
import GroupGetResponse from '../../service/api-service/schema/response/GroupGetResponse';
import ExpenseItemComponent from '../expenses/ExpenseItemComponent';
import { useTranslation } from 'react-i18next';
import ExpenseResponse from '../../service/api-service/schema/response/ExpenseResponse';
import ExpenseService from '../../service/api-service/expense-service';
import ToastService from '../../service/toast-service';

const GroupDetailsComponent: React.FC = () => {
  // Use the translation hook to get the t function from i18n
    const { t } = useTranslation();
    const [group, setGroup] = useState<GroupGetResponse>();

     // State to store group details, expenses, and pagination details
    const [expenses, setExpenses] = useState<ExpenseResponse[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const pageSize = 5;

     // Get category and id from route parameters
    const { category, id } = useParams();

     // Use the navigate hook for navigation within the app
    const navigate = useNavigate();

     // Callback function to fetch expenses based on group ID and pagination
    const getExpenseByGroupId = useCallback(async () => {
      const queryParams = {
        groupId: id || '',
        page: page, 
        size: pageSize,
      }
      const response = await ExpenseService.find(queryParams);
      setExpenses((prevExpenses) => [...prevExpenses, ...response.data]);
      setTotalPages(response.meta.totalPages);
    }, [page]);

    // Callback function to load more expenses when the "Load More" button is clicked
    const handleLoadMore = () => {
      if (page < totalPages) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    // Effect to fetch group details and expenses when the component mounts or when pagination changes
    useEffect(() => {
        // Call Expense API For the group
        console.log("Group Details");
      

        const getGroupById = async () => {
            console.log("Group Id: ", id);
            const result = await GroupService.findById(id || '');
            console.log("Group Details: ", result.name);
            setGroup(result);
        }
        // Call group by group id
        getGroupById();

        // Call Expense API For the group
        getExpenseByGroupId();

    }, [getExpenseByGroupId]);

    // Callback function for handling the edit action on an expense
    const editCallback = (expense: ExpenseResponse) => {
      console.log("Edit callback called for expense: ", expense);
      try {
        console.log("category: ", category, " id: ", id);
        let entityId = expense.id;
        if (category === "group" || category === "friend") {
          entityId = id as string;
        }

        console.log("entityId: ", entityId);

        const url = `/app/expenses/save/${category}/edit/${entityId}/`;
        console.log("we will navigate to: ", url);
        navigate(url);
      } catch (error) {
        console.error("Error in edit callback: ", error);
        ToastService.handleError(error);
      }
    };

     // Callback function for handling the delete action on an expense
    const deleteCallback = async (expense: ExpenseResponse) => {
      console.log('Delete callback called for expense: ', expense);
      try {
        await ExpenseService.remove(expense.id);
        const message = t('expenseDeleted');
        ToastService.handleSuccess(message);			
        setExpenses((prevExpenses) => prevExpenses.filter((e) => e.id !== expense.id));
      } catch (error) {
        console.error('Error deleting expense: ', error);
        ToastService.handleError(error);
      }	
    }

    return (
      <div>
        {/* Box for displaying group name and action buttons */}
        <Box bgcolor="#f8f8f8" p={2} borderRadius={4} marginBottom={2}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h4">{group?.name}</Typography>
            </Grid>
            <Grid item>
               {/* Link to edit the group details */}
              <Link to={`/app/groups/${group?.id}/edit`} style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  style={{ marginRight: "20px",  backgroundColor: "#ff652f" }}
                >
                  Edit Group
                </Button>
              </Link>
              {/* Link to add a new expense */}
              <Link to="/app/expenses/save/personal/add/new" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  style={{ marginRight: "20px", backgroundColor: "#32c29f" }}
                >
                  Add Expense
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Box>

      {/* List of expenses using ExpenseItemComponent */}
			<List>
				{expenses.map((expense) => (
					<ExpenseItemComponent 
						key={expense.id} 
						expense={expense} 
						deleteCallback={deleteCallback} 
						editCallback={editCallback} />
				))}
			</List>

      {page < totalPages && (
				<Button onClick={handleLoadMore} variant="contained" color="primary" fullWidth>
					Load More
				</Button>
			)}

      </div>
    );
} 

export default GroupDetailsComponent;