export default interface ExpenseRequest {
    description: string;
    amount: number;
    paidBy: string;
    date: string; //YYYY-MM-DD
    category: string;
    groupId: string;
    split: {
        type: string;
        payload: {
            [key: string]: number | string[];
        };
    };
}
