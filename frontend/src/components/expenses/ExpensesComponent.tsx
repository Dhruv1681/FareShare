import { Navigate, Route, Routes } from "react-router-dom";
import SaveExpenseComponent from "./SaveExpenseComponent";
import ListExpensesComponent from "./ListExpensesComponent";
import ViewExpenseComponent from "./ViewExpenseComponent";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../state/store/store";
import { useEffect, useRef } from "react";
import { setExpensesActivity } from "../../state/slice/activity-slice";

const ExpensesComponent: React.FC = () => {
  const dataLoaded = useRef(false);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
		if (dataLoaded.current || process.env.NODE_ENV !== 'development') {
			dispatch(setExpensesActivity());
		}

		return  () => { dataLoaded.current = true; }
	}, []);

  return (
    <Routes>
      <Route index element={<Navigate to="list/personal/all" />} />
      <Route path="list/:category/:id/*" element={<ListExpensesComponent />} />
      <Route path="save/:category/:action/:id/*" element={<SaveExpenseComponent />} />
      <Route path="view/:expenseId/*" element={<ViewExpenseComponent />} />
    </Routes>
  );
}

export default ExpensesComponent;