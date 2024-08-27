import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import AuthService from '../../service/api-service/auth-service';
import RegisterUserRequest from '../../service/api-service/schema/request/RegisterUserRequest';
import ToastService from '../../service/toast-service';
import { setEmail } from '../../state/slice/otp-slice';
import { AppDispatch } from '../../state/store/store';

interface ValidationErrors {
    email: boolean;
    username: boolean;
    firstname: boolean;
    lastname: boolean;
}

const RegistrationComponent: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const [formData, setFormData] = useState<RegisterUserRequest>({
        email: '',
        username: '',
        firstname: '',
        lastname: '',
        nickname: '',
    });

    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
        email: false,
        username: false,
        firstname: false,
        lastname: false,
    });

    const [isVisited, setIsVisited] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateField = (fieldName: string, value: string): boolean => {
        switch (fieldName) {
            case 'email':
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            case 'username':
                // Allow letters, numbers, and some common special characters
                return /^[a-zA-Z0-9!@#$%^&*()_+{}[\]:;<>,.?~\\/-]+$/g.test(value);
            case 'firstname':
            case 'lastname':
                return /^[a-zA-Z\s]*$/.test(value);
            default:
                return true;
        }
    };

    const handleBlur = () => {
        setIsVisited(true);
        validateAllFields();
    };

    const validateAllFields = () => {
        const updatedValidationErrors: ValidationErrors = {
            email: false,
            username: false,
            firstname: false,
            lastname: false,
        };

        for (const field in formData) {
            updatedValidationErrors[field as keyof ValidationErrors] = !validateField(
                field,
                formData[field as keyof RegisterUserRequest]
            );
        }
        
        setValidationErrors(updatedValidationErrors);
    };

    const handleContinueClick = async () => {
        validateAllFields();

        if (Object.values(validationErrors).some((error) => error)) {
            return;
        }

        try {
            const response = await AuthService.post(formData);
            console.log('Response:', response);
            ToastService.handleSuccess(response.message);

            dispatch(setEmail(formData.email));
            navigate('/home/otp');
        } catch (error: any) {
            console.error('Error:', error);
            ToastService.handleError(error);
        }
    };

    return (
        <div className="col-md-6">
            <div className="card rounded-lg">
                <div className="card-body">
                    <h5 className="card-title text-left font-bold">
                        Register Account in FairShare
                    </h5>

                    {Object.keys(formData).map((field) => (
                        <div className="form-group" key={field}>
                            <input
                                type="text"
                                className={`form-control form-green-focus ${isVisited && validationErrors[field as keyof ValidationErrors]
                                        ? 'is-invalid'
                                        : ''
                                    }`}
                                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                required
                                name={field}
                                value={formData[field as keyof RegisterUserRequest]}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                            />

                            {isVisited && validationErrors[field as keyof ValidationErrors] && (
                                <div className="invalid-feedback">Invalid {field} format</div>
                            )}
                        </div>
                    ))}

                    <button
                        className="hoverable btn btn-block bg-green font-bold text-white"
                        onClick={handleContinueClick}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegistrationComponent;
