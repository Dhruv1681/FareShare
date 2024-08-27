export default interface GroupSaveRequest {
    name: string,
    type: string,
    members: Member[],
    simplifiedDebt: boolean
}

interface Member {
    id: string;
}