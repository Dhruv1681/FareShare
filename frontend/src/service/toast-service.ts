import { toast } from "react-hot-toast";

class ToastService {
	private static readonly SOMETHING_WENT_WRONG  = 'Something went wrong!';

    public static handleSuccess = (message: string, duration?: number) => {
        console.log('Toast Service handleSuccess', message);
        toast.success(message, { duration: duration || Infinity })
    }

	public static handleError = (error: any, duration?: number) => {
        console.log('Toast Service handleError', error);
		toast.error(error.message || this.SOMETHING_WENT_WRONG, { duration: duration || Infinity })
	}
}

export default ToastService;
