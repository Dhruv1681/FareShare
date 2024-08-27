/**
 * A service for managing data in the browser's local storage.
 * @class
 */
class LocalStorageService {
	/**
	 * The key used for storing the authentication token in local storage.
	 * @type {string}
	 * @private
	 * @readonly
	 */
	private static readonly AUTH_TOKEN_KEY = '_bearer';

	/**
	 * Store the authentication token in local storage.
	 * @param {string} token - The authentication token to be stored.
	 * @returns {void}
	 */
	public static storeToken = (token: string): void => {
		localStorage.setItem(this.AUTH_TOKEN_KEY, token);
	};

	/**
	 * Retrieve the authentication token from local storage.
	 * @returns {string | null} The authentication token if present, otherwise null.
	 */
	public static getStoredToken = (): string | null => {
		return localStorage.getItem(this.AUTH_TOKEN_KEY);
	};

	/**
	 * Remove the stored authentication token from local storage.
	 * @returns {void}
	 */
	public static removeToken = (): void => {
		localStorage.removeItem(this.AUTH_TOKEN_KEY);
	};
}

export default LocalStorageService;
