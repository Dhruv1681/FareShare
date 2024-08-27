import { toast, ToastBar, Toaster } from "react-hot-toast";

export default function ToastComponent() {
    return (
        <Toaster>
            {(t) => (
                <ToastBar toast={t}>
                    {({ icon, message }) => (
                        <>
                            {icon}
                            {message}
                            {t.type !== 'loading' && (
                                <button 
                                    type="button" 
                                    className="close" 
                                    aria-label="Close" 
                                    onClick={() => toast.dismiss(t.id)}>
                                    
                                    <span aria-hidden="true">&times;</span>
                                
                                </button>
                            )}
                        </>
                    )}
                </ToastBar>
            )}
        </Toaster>
    );
}
