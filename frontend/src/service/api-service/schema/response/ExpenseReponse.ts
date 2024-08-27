export default interface ExpenseResponse {
    id: number;
    description: string;
    amount: number;
    personalShare: number;
    category: string;
    date: string;
    otherPeopleShare: { username: string; share: number }[];
}
