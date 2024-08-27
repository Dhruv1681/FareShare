import jwt from 'jsonwebtoken';

import { SWAGGER_API_PATH, HTTP_STATUS, MESSAGE, HTTP_METHOD, HTTP_HEADERS, AUTH_SCHEME } from '../constants.js';
import { setErrorResponse } from '../controllers/response-handler.js';
import { throwError } from '../validators/validator.js';

import userAccessService from '../services/entity-services/user-access-service.js';
import userService from '../services/entity-services/user-service.js';
import expiredTokenService from '../services/entity-services/expired-token-service.js'

const nonProtectedRoutes = [
    { path: '/auth', method: HTTP_METHOD.POST },
    { path: '/auth', method: HTTP_METHOD.PUT },
    { path: '/auth/otp', method: HTTP_METHOD.POST },
    { path: '/admin', method: HTTP_METHOD.POST }
];

const verifyToken = async (request, response, next) => {
    try {
        // Check if the route is in the nonProtectedRoutes array
        const isNonProtected = request.path.includes(SWAGGER_API_PATH)
            || nonProtectedRoutes.some(
                route => route.path === request.path && route.method === request.method
            );

        if (isNonProtected) {
            // Skip token verification for non-protected routes
            return next();
        }

        // Get the token from the request headers
        const authHeader = request.header(HTTP_HEADERS.AUTHORIZATION);

        if (!authHeader) {
            // Token is missing
            throwError(MESSAGE.ERROR_AUTHENTICATION_FAILED, HTTP_STATUS.UNAUTHORIZED);
        }

        // Split the header into parts
        const tokenParts = authHeader.split(' ');

        // Check if the header format is correct (Bearer scheme)
        if (tokenParts.length !== 2 || tokenParts[0] !== AUTH_SCHEME.BEARER) {
            throwError(MESSAGE.ERROR_AUTHENTICATION_FAILED, HTTP_STATUS.UNAUTHORIZED);
        }

        const token = tokenParts[1];

        try {
            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // console.log('decoded', decoded);

            const user = await userService.findByIdAndNotDeleted(decoded.userId);
            if (!user) {
                throwError(MESSAGE.ERROR_AUTHENTICATION_FAILED, HTTP_STATUS.UNAUTHORIZED);
            }

            request.user = user; // Attach the user to the request
            request.token = token; // Attach the token to the request

            // Create a user access record
            const { path, method, body } = request;
            await userAccessService.addUserAccess(user._id, path, method, body);

            const isExpiredToken = await expiredTokenService.isExpired(token);
            if (isExpiredToken) {
                throwError(MESSAGE.ERROR_AUTHENTICATION_FAILED, HTTP_STATUS.UNAUTHORIZED);
            }

            return next();
        } catch (error) {
            console.error('JWT Error occured', error.message, error);
            throwError(MESSAGE.ERROR_AUTHENTICATION_FAILED, HTTP_STATUS.UNAUTHORIZED);
        }
    } catch (error) {
        console.error('Error occured', error.message, error);
        setErrorResponse(response, error);
    }

};

export default verifyToken;
