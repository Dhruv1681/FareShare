import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Typography, Grid, Button, Box, List, ListItem, ListItemText } from '@mui/material';
import { useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import ExpenseResponse from '../../service/api-service/schema/response/ExpenseResponse';
import ExpenseService from '../../service/api-service/expense-service';
import ExpenseItemComponent from './ExpenseItemComponent';
import ToastService from '../../service/toast-service';

const ListExpensesComponent: React.FC = () => {
	const { t } = useTranslation();

	const navigate = useNavigate();

	const dataLoaded = useRef(false);

	const { category, id } = useParams();
	const [expenses, setExpenses] = useState<ExpenseResponse[]>([]);
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);
	const pageSize = 5;

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

	const editCallback = (expense: ExpenseResponse) => {
		console.log('Edit callback called for expense: ', expense);
		try {
			console.log('category: ', category, ' id: ', id);
			let entityId = expense.id;
			if ( (category === 'group') || (category === 'friend') ) {
				entityId = id as string;
			}

			console.log('entityId: ', entityId);

			const url = `/app/expenses/save/${category}/edit/${entityId}/`;
			console.log('we will navigate to: ', url);
			navigate(url);
		} catch (error) {
			console.error('Error in edit callback: ', error);
			ToastService.handleError(error);
		}
	}

	const fetchExpenses = useCallback(async () => {
		try {
			const queryParams = { 
				page: page, 
				size: pageSize, 
			};

			const response = await ExpenseService.find(queryParams);

			setExpenses((prevExpenses) => [...prevExpenses, ...response.data]);
			setTotalPages(response.meta.totalPages);
		} catch (error) {
			console.error('Error fetching expenses:', error);
		}
	}, [page, category, id]);

	useEffect(() => {
		if (dataLoaded.current || process.env.NODE_ENV !== 'development') {
			fetchExpenses();
		}
		
		return () => { dataLoaded.current = true }
	}, [fetchExpenses]);

	const handleLoadMore = () => {
		if (page < totalPages) {
			setPage((prevPage) => prevPage + 1);
		}
	};

	const handleExportExpenses = async () => {
        try {
           	const csvResponse = await ExpenseService.export({expenses});
            // Create a Blob from the response data
            const blob = new Blob([csvResponse.data], { type: 'text/csv' });
            // Create a download link and trigger a click to download the file
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'expense.csv';
            link.click();
        } catch (error: any) {
            console.error('Error in downloadCsv', error);
        }
    };

	return (
		<div>
			<Box bgcolor="#f8f8f8" p={2} borderRadius={4} marginBottom={2}>
				<Grid container alignItems="center" justifyContent="space-between">
					<Grid item>
						<Typography variant="h4">{t('expenses')}</Typography>
					</Grid>
					<Grid item>
						<Button
							variant="contained"
							color="primary"
							size="medium"
							style={{ marginRight: '20px', backgroundColor: '#32c29f' }}
							onClick={handleExportExpenses}
						>
							+ {t('Export Expenses')}
						</Button>
						<Link to="/app/expenses/save/personal/add/new" style={{ textDecoration: 'none' }}>
							<Button
								variant="contained"
								color="primary"
								size="medium"
								style={{ marginRight: '20px', backgroundColor: '#32c29f' }}
							>
								+ {t('addExpense')}
							</Button>
						</Link>
					</Grid>
				</Grid>
			</Box>

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
};

export default ListExpensesComponent;
