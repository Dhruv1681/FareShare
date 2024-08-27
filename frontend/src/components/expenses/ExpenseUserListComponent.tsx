import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import { useEffect, useState, useRef } from 'react';
import UserGetResponse from '../../service/api-service/schema/response/UserGetResponse';

interface Props {
	users: UserGetResponse[];
	splitType: string;
	amount: number;
	arrayStateChanged: (users: string[]) => void;
	mapStateChanged: (state: { [key: string]: number }) => void;
}

const ExpenseUserListComponent = (props: Props) => {
	const dataLoaded = useRef(false);

	const [textFields, setTextFields] = useState<{ [key: string]: number }>({});
	const [selectedUsers, setSelectedUsers] = useState<UserGetResponse[]>([]);
	const [searchValue, setSearchValue] = useState<string>('');

	const setPayload = (users: UserGetResponse[], payload: { [key: string]: number }) => {
		console.log('setPayload called with users: ', users, ' and payload: ', payload);
	}

	useEffect(() => {
		if (dataLoaded.current || process.env.NODE_ENV !== 'development') {
			dispatchValueChange();
		}

		return () => { dataLoaded.current = true }
	}, [props, selectedUsers, textFields]);

	const handleAddUser = (user: UserGetResponse | null) => {
		if (!user) {
			return;
		}

		if (selectedUsers.find((u) => u.id === user.id)) {
			setSearchValue('');
			return;
		}

		const sortedUsers = [...selectedUsers, user].sort((a, b) =>
			a.fullname.localeCompare(b.fullname)
		);

		setSelectedUsers(sortedUsers);
		setSearchValue('');

		setTextFields((prevTextFields) => {
			const newFields = { ...prevTextFields };
			newFields[user.username] = 1;
			return newFields;
		});
	};

	const handleRemoveUser = (index: number) => {
		setSelectedUsers((prevUsers) => prevUsers.filter((_, i) => i !== index));
		setTextFields((prevTextFields) => {
			const newFields = { ...prevTextFields };
			delete newFields[selectedUsers[index].username];
			return newFields;
		});
	};

	const handleTextFieldChange = (userId: string, value: number) => {
    setTextFields((prevTextFields) => ({ ...prevTextFields, [userId]: value }));
  };

	const dispatchValueChange = () => {
		console.log('dispatchValueChange');
		if ((props.splitType === 'equal') || (props.splitType === 'reimbursement')) {
			const selectedUsernames = selectedUsers.map((user) => user.username);
			console.log('selectedUsernames', selectedUsernames);
			props.arrayStateChanged(selectedUsernames);
		} else {
			console.log('textFields', textFields);
			props.mapStateChanged(textFields);
		}
	}

	return (
		<Box p={2} border="1px solid #ddd" borderRadius={4} minHeight="29rem">
			<Autocomplete
				options={props.users}
				getOptionLabel={(option) => option.fullname}
				onChange={(_, newValue) => handleAddUser(newValue)}
				inputValue={searchValue}
				onInputChange={(_, newInputValue) => setSearchValue(newInputValue)}
				renderInput={(params) => <TextField {...params} label="Search Users" />}
			/>

			<div className="expense-users-box">
				<List>
					{selectedUsers.map((user, index) => (
						<ListItem key={index}>
							<ListItemText primary={user.fullname} />

							{/* Display the appropriate UI element based on splitType */}
							{props.splitType === 'unequal' && (
								<TextField
									variant="outlined"
									type="number"
									defaultValue={1.00}
									label="$"
									onChange={(e) => handleTextFieldChange(user.username, +e.target.value)}
								/>
							)}
							{props.splitType === 'shares' && (
								<TextField
									variant="outlined"
									type="number"
									defaultValue={1.00}
									label="Shares"
									onChange={(e) => handleTextFieldChange(user.username, +e.target.value)}
								/>
							)}
							{props.splitType === 'percentage' && (
								<TextField
									variant="outlined"
									type="number"
									defaultValue={1.00}
									label="Percentage"
									onChange={(e) => handleTextFieldChange(user.username, +e.target.value)}
								/>
							)}

							<Button onClick={() => handleRemoveUser(index)}>
								Remove
							</Button>
						</ListItem>
					))}
				</List>
			</div>
		</Box>
	);
};

export default ExpenseUserListComponent;
