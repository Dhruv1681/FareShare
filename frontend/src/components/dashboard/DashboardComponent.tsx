import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button, TextField, Grid } from "@mui/material";

import ExpenseService from "../../service/api-service/expense-service";
import ExpenseResponse from "../../service/api-service/schema/response/ExpenseResponse";
import AddExpenseModalComponent from "./AddExpenseModalComponent";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setDashboardActivity } from "../../state/slice/activity-slice";
import { AppDispatch, RootState } from "../../state/store/store";

const DashboardComponent: React.FC = () => {
  const { t } = useTranslation();

  const userState = useSelector((state: RootState) => state.userReducer);

  const dataLoaded = useRef(false);

  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();

  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [expenseList, setExpenseList] = useState<ExpenseResponse[]>([]);

  const fetchExpenseList = async () => {
    try {
      const data = await ExpenseService.find();
      console.log("Expense list:", data);
      setExpenseList(data as any);
    } catch (error: any) {
      console.error("Error in fetchExpenseList", error);
    }
  };

  useEffect(() => {
    if (dataLoaded.current || process.env.NODE_ENV !== "development") {
      dispatch(setDashboardActivity());
      fetchExpenseList();
    }

    return () => {
      dataLoaded.current = true;
    };
  }, []);

  const handleAddExpense = () => {
    console.log("Add Expense clicked");
    // displayAddExpenseModal();
    navigate("/app/expenses/save/personal/add/new");
  };

  const displayAddExpenseModal = () => {
    setShowAddExpenseModal(true);
  };

  const hideAddExpenseModal = () => {
    setShowAddExpenseModal(false);
  };

  const handleEditExpense = (expenseId: string) => {
    // Implement edit logic here
    console.log("Edit Expense clicked for expense ID:", expenseId);
  };

  const handleDeleteExpense = async (expenseId: string) => {
    console.log("Delete Expense clicked for expense ID:", expenseId);
    try {
      await ExpenseService.remove(expenseId);
      fetchExpenseList();
      console.log("Expense deleted successfully:", expenseId);
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <>
      <div className="row">
        <div className="col align-items-center">
          <div className="font-bold font-2-x d-inline-block">{t("Dashboard")}</div>

          {/* <div className="float-right d-inline-block">
            <button
              className="btn bg-white color-green border-green font-bold text-hover-green"
              onClick={handleAddExpense}
            >
              + {t("addExpense")}
            </button>
          </div> */}
        </div>
      </div>
      <div className="justify-content-center">
        <div>
          <h2>Welcome {userState.fullname}</h2>
        </div>{" "}
        <br />
        <div className="row">
          <div className="col">
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Button variant="contained" onClick={handleAddExpense}>
                  Add Expense
                </Button>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
      {/* <AddExpenseModalComponent show={showAddExpenseModal} onHide={hideAddExpenseModal} /> */}
    </>
  );
};

export default DashboardComponent;
