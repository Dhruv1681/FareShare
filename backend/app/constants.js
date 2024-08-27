export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    CONFLICT: 409,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
};

export const TRANSACTION_CATEGORIES = {
    FOOD_AND_DRINK: {
        DINING_OUT: 'Dining Out',
        GROCERIES: 'Groceries',
        LIQUOR: 'Liquor',
        OTHER: 'Other'
    },
    ENTERTAINMENT: {
        GAMES: 'Games',
        MOVIES: 'Movies',
        MUSIC: 'Music',
        SPORTS: 'Sports',
        OTHER: 'Other'
    },
    HOME: {
        ELECTRONICS: 'Electronics',
        FURNITURE: 'Furniture',
        HOUSEHOLD_SUPPLIES: 'Household Supplies',
        MAINTENANCE: 'Maintenance',
        MORTGAGE: 'Mortgage',
        OTHER: 'Other',
        PETS: 'Pets',
        RENT: 'Rent',
        SERVICES: 'Services'
    },
    LIFE: {
        CHILDCARE: 'Childcare',
        CLOTHING: 'Clothing',
        EDUCATION: 'Education',
        GIFTS: 'Gifts',
        INSURANCE: 'Insurance',
        MEDICAL_EXPENSES: 'Medical Expenses',
        OTHER: 'Other',
        TAXES: 'Taxes'
    },
    TRANSPORTATION: {
        BICYCLE: 'Bicycle',
        BUS_OR_TRAIN: 'Bus/Train',
        CAR: 'Car',
        GAS_OR_FUEL: 'Gas/Fuel',
        HOTEL: 'Hotel',
        OTHER: 'Other',
        PARKING: 'Parking',
        PLANE: 'Plane',
        TAXI: 'Taxi'
    },
    UNCATEGORIZED: {
        GENERAL: 'General'
    },
    UTILITIES: {
        CLEANING: 'Cleaning',
        ELECTRICITY: 'Electricity',
        HEAT_OR_GAS: 'Heat/Gas',
        OTHER: 'Other',
        TRASH: 'Trash',
        TV_OR_PHONE_INTERNET: 'TV/Phone/Internet',
        WATER: 'Water'
    }
};
export const SPLIT_TYPES = {
    EQUAL: 'equal',
    PERCENTAGE: 'percentage',
    UNEQUAL: 'unequal',
    SHARES: 'shares',
    REIMBURSE: 'reimburse',
    SETTLEMENT: 'settlement',
    ITEMIZED: 'itemized',
};

export const MESSAGE_CREATORS = {
    paidByUsernameInvalid: (username) => `Paid by username ${username} is invalid`,
    usernameInvalid: (username) => `Username ${username} is invalid`,
}

export const MESSAGE = {
    USER_REGISTERED_OTP_SENT: 'User successfully registered. OTP sent to the provided email.',
    USER_OTP_SENT: 'OTP sent to the provided email.',
    USER_LOGGED_OUT: 'User logged out successfully',
    USER_ACCOUNT_DELETED: 'User account deleted successfully',
    USER_TRANSACTION_DELETED: 'User transaction deleted successfully',
    USER_EXPENSE_ADDED: "Expense has been added successfully",

    FRIEND_ADDED: 'Friend added successfully',

    GROUP_ADDED: 'Group added successfully',
    GROUP_UPDATED: 'Group updated successfully',

    ERROR_SOMETHING_WENT_WRONG: 'Something Went Wrong',
    ERROR_USER_EMAIL_MISSING: 'User Email ID is required',
    ERROR_USER_EMAIL_INVALID: 'User Email ID is invalid',
    ERROR_USER_NAME_MISSING: 'User Name is required',
    ERROR_USER_ALREADY_EXISTS: 'User with the provided email already exists',
    ERROR_USER_NOT_EXISTS: 'User with the provided email does not exist',
    ERROR_USERNAME_NOT_EXISTS: 'User with the provided username does not exist',
    ERROR_TOO_FAST_OTP: 'Too many OTPs generated. Please try again later.',
    ERROR_OTP_MISSING: 'Please provide the OTP',
    ERROR_OTP_NOT_SEND: 'An OTP was never sent to your email ID',
    ERROR_INVALID_OTP: 'Invalid OTP entered',
    ERROR_AUTHENTICATION_FAILED: 'Authentication Failed',

    ERROR_PAYLOAD_MISSING: 'Payload is missing',
    ERROR_DESCRIPTION_MISSING: 'Invalid or missing description',
    ERROR_AMOUNT_MISSING: 'Invalid or missing amount',
    ERROR_DATE_MISSING: 'Invalid or missing date',
    ERROR_CATEGORY_MISSING: 'Category is required',
    ERROR_INVALID_CATEGORY: 'Category is invalid',
    ERROR_PAID_BY_MISSING: 'Missing paid by user',
    ERROR_PAID_BY_USERNAME_NOT_EXISTS: 'Paid by user does not exist',
    ERROR_SPLIT_BY_MISSING: 'Split information missing',
    ERROR_SPLIT_BY_TYPE_MISSING: 'Split Type is missing or invalid',
    ERROR_INVALID_SPLIT_TYPE: 'Split Type is invalid',
    ERROR_INVALID_GROUP: 'Invalid Group specified',

    ERROR_USERNAME_INVALID: 'Username is invalid',
    ERROR_ALREADY_FRIEND: 'User is already a friend',
    ERROR_SELF_FRIEND: 'Cannot add self as friend',

    ERROR_NEGATIVE_VALUES: 'Negative values are not allowed',
    ERROR_SUM_NOT_MATCH: 'Sum of split amounts does not match the total amount',
    ERROR_PERCENTAGE_SUM_NOT_100: 'Sum of percentages does not add up to 100',
    ERROR_NON_DECIMAL_VALUES: 'Non decimal values are not allowed',
    ERROR_SELF_SETTLEMENT_NOT_ALLOWED: 'Cannot settle with self',
    ERROR_SAME_USER_SETTLEMENT_NOT_ALLOWED: 'Cannot settle with the same user',

    ERROR_OPERATION_NOT_SUPPORTED: 'Operation not supported',
    ERROR_TOTAL_SHARES_ZERO_NOT_ALLOWED: 'Total shares cannot be zero',

    ERROR_EXPENSE_ID_REQUIRED: 'Expense ID is required',
    ERROR_EXPENSE_NOT_FOUND: 'Expense not found',

    ERROR_UNAUTHORIZED_ACCESS: 'Unauthorized Access',
    ERROR_GROUP_NOT_FOUND: 'Group not found',

    ERROR_INVALID_ACTION: 'Invalid Action',
}

/**
* Enum representing color values.
* @readonly
* @enum {string}
* @property {string} RED - The color red.
* @property {string} GREEN - The color green.
* @property {string} GREY - The color grey.
*/
export const COLORS = {
    RED: 'red',
    GREEN: 'green',
    GREY: 'grey',
};

/**
 * Enum representing various administrative actions.
 * @enum {string}
 * @readonly
 * @namespace
 */
export const ADMIN_ACTION = {
    /**
     * Action to trigger the recalculation of ledgers.
     * @type {string}
     * @description Use this action when you need to recalculate financial ledgers.
     */
    RECALCULATE_LEDGERS: 'recalculate-ledgers',

    /**
     * Action to send a test mail.
     * @type {string}
     * @description Use this action to initiate the sending of a test email.
     */
    SEND_TEST_MAIL: 'send-test-mail',

    /**
     * Action to delete all entities.
     * @type {string}
     * @description Use this action to delete all entities.
     */
    DELETE_ENTITIES: 'delete-entities',
}

/**
 * Enum representing various administrative messages.
 * @type {AdminMessage}
 * @readonly
 * @namespace
 */
export const ADMIN_MESSAGE = {
    /**
     * Message indicating the successful recalculation of ledgers.
     * @type {string}
     * @description This message is displayed when the ledgers have been recalculated successfully.
     */
    SUCCESS_RECALCULATE_LEDGERS: 'Ledgers recalculated successfully',

    /**
     * Message indicating the successful sending of a mail.
     * @type {string}
     * @description This message is displayed when a mail has been sent successfully.
     */
    SUCCESS_MAIL_SENT: 'Mail sent successfully',

    /**
     * Message indicating the successful deletion of all entities.
     * @type {string}
     * @description This message is displayed when all entities have been deleted successfully.
     */
    SUCCESS_DELETE_ENTITIES: 'Entities deleted successfully',
}

export const jsonMessage = (text) => ({ message: text });

export const REGEX = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    DATE: /^\d{4}-\d{2}-\d{2}$/,
}

export const OTP_LENGTH = 6;

export const HTTP_METHOD = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH',
}

export const HTTP_HEADERS = {
    AUTHORIZATION: 'Authorization'
}

export const AUTH_SCHEME = {
    BASIC: 'Basic',
    DIGEST: 'Digest',
    BEARER: 'Bearer',
}

export const SWAGGER_API_PATH = '/api-docs';
