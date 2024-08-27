export default interface ExpenseResponse {
    id: string;
    description: string;
    amount: number;
    paidBy: string;
    category: string;
    groupId: string;
    split: {
        type: string;
        payload: {
            [key: string]: number | string[];
        };
    };
    shares: {
        [key: string]: number;
    };
    ledger: {
        [key: string]: number;
    };
    createdOn: string;
    updatedOn: string;
    createdBy: string;
    updatedBy: string;
    date: string,
    extraData: {
        monthText: string,
        dateText: string,
        paidByText: string,
        shareText: string,
        fontColor: string,
        amountText: string
    }
}
