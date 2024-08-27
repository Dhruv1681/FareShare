import { useState, useEffect, useRef } from 'react';

import ExpenseResponse from '../../service/api-service/schema/response/ExpenseReponse';

interface AddExpenseModalProps {
	show: boolean;
	onHide: () => void;
	initialExpenseData?: ExpenseResponse;
}

interface ExpenseData {
	description: string;
	amount: number;
	personalShare: number;
	category: string;
	date: string;
	participants: string;
}

const AddExpenseModalComponent: React.FC<AddExpenseModalProps> = ({ show, onHide, initialExpenseData }) => {
	const dataLoaded = useRef(false);

	const [expenseData, setExpenseData] = useState<ExpenseData>({
		description: '',
		amount: 0,
		personalShare: 0,
		category: '',
		date: '',
		participants: '',
	});

	useEffect(() => {
		if (dataLoaded.current || process.env.NODE_ENV !== 'development') {
			if (initialExpenseData) {
				const data = {
					...initialExpenseData, 
					participants: initialExpenseData.otherPeopleShare.map(person => person.username).join(', '), 
					otherPeopleShare: null
				};
				setExpenseData(data);
			}
		}

		return  () => { dataLoaded.current = true; }
	}, [initialExpenseData]);

	const handleSaveExpense = () => {
		console.log('Expense saved');
		
		onHide();
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = event.target;
		setExpenseData((prevData) => ({ ...prevData, [id]: value }));
	};

	return (
		<div className={`modal ${show ? 'show' : ''}`} tabIndex={-1} role="dialog" style={{ display: show ? 'block' : 'none' }}>
			<div className="modal-dialog" role="document">
				<div className="modal-content">
					<div className="modal-header bg-green text-white">
						<h5 className="modal-title font-bold">Add Expense</h5>
						<button type="button" className="close font-bold" onClick={onHide}>
							<span>&times;</span>
						</button>
					</div>
					<div className="modal-body">
						<div className="form-group">
							<label htmlFor="description">Description</label>
							<input type="text" className="form-control" id="description" placeholder="Enter description" onChange={handleInputChange} />
						</div>

						<div className="form-group">
							<label htmlFor="amount">Amount</label>
							<input type="number" className="form-control" id="amount" placeholder="Enter amount" onChange={handleInputChange} />
						</div>

						<div className="form-group">
							<label htmlFor="participants">Participants</label>
							<input type="text" className="form-control" id="participants" placeholder="Enter participants (comma-separated)" onChange={handleInputChange} />
						</div>
					</div>
					<div className="modal-footer">
						<button type="button" className="btn btn-secondary" onClick={onHide}>
							Close
						</button>
						<button type="button" className="btn bg-green text-white" onClick={handleSaveExpense}>
							Save Expense
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddExpenseModalComponent;
