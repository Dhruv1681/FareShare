import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpenseResponse from "../../service/api-service/schema/response/ExpenseResponse";

interface GroupExpensesProps {
  expenses: Array<ExpenseResponse>;
}

// This component is used to display the list of expenses for a group
const GroupExpensesComponent: React.FC<GroupExpensesProps> = ({ expenses }) => {
  return (
    // Display the list of expenses in an accordion
    <div>
      {/* Loop through the expenses array and display each expense in an accordion */}
      {expenses.map((expense, index) => (
        <Accordion key={index}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index + 1}a-content`}
            id={`panel${index + 1}a-header`}
          >
            <Typography>{expense.description}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              {/* Display other details of the expense here */}
              Amount: {expense.amount}
              {/* Add more details as needed */}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default GroupExpensesComponent;
