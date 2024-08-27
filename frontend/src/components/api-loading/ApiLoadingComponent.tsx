import { useSelector } from "react-redux";

import { RootState } from "../../state/store/store";

import LoadingComponent from "../loading/LoadingComponent";


export default function ApiLoadingComponent() {
    const loading = useSelector((state: RootState) => state.apiReducer.loading);
    return (
        <>
            {loading && <LoadingComponent />}
        </>
    );
}
