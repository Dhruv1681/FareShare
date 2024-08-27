export default interface GroupGetResponse {
    id: string;
    name: string;
    category: string;
    image: string;
    members: Member[];
    simplifiedDebt: boolean;
}

interface Member {
    id: string;
    name: string;
    email: string;
}
  
