import { useParams } from "react-router-dom";

const ViewExpenseComponent: React.FC = () => {
    const { id } = useParams();

  return (
    <div>
      <p>View Expenses Component</p>
      <p>id: {id}</p>
    </div>
  );
}

export default ViewExpenseComponent;
