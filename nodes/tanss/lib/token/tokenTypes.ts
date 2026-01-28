/**
 * The supported authentication methods for Tanss API.
 */
export type AuthenticateType = 'apiToken' | 'loginTotp';

/**
 * The key types available for authentication.
 */
export type KeyType = 'system' | 'user';

/**
 * Mapping of KeyType to AuthenticateType.
 */
export const AuthenticateTypeMap: Record<KeyType, AuthenticateType> = {
	system: 'apiToken',
	user: 'loginTotp',
};

/**
 * Type guard to check if the value is a valid AuthenticateType.
 * @param value The value to check
 * @returns True if the value is AuthenticateType, false otherwise
 */
export function isAuthenticateType(value: unknown): value is AuthenticateType {
	return value === AuthenticateTypeMap.system || value === AuthenticateTypeMap.user;
}

/**
 * The structure of the credentials used for authentication.
 */
export interface ICredentials
	extends Partial<IApiTokenCredentials>, Partial<ILoginTotpCredentials> {
	baseURL: string;
	authentication: AuthenticateType;
}

/**
 * Type guard to check if the provided object conforms to ICredentials.
 * @param obj The object to check
 * @returns True if the object is ICredentials, false otherwise
 */
export function isICredentials(obj: unknown): obj is ICredentials {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		'baseURL' in obj &&
		typeof obj.baseURL === 'string' &&
		obj.baseURL.trim() !== '' &&
		'authentication' in obj &&
		typeof obj.authentication === 'string' &&
		obj.authentication.trim() !== '' &&
		isAuthenticateType(obj.authentication)
	);
}

/**
 * The structure of credentials required for API token authentication.
 */
export interface IApiTokenCredentials {
	apiToken: string;
}

/**
 * Type guard to check if the credentials object conforms to IApiTokenCredentials.
 * @param obj The credentials object to check
 * @returns True if the object is IApiTokenCredentials, false otherwise
 */
export function isIApiTokenCredentials(
	obj: ICredentials,
): obj is ICredentials & IApiTokenCredentials {
	return 'apiToken' in obj && typeof obj.apiToken === 'string' && obj.apiToken.trim() !== '';
}

/**
 * The structure of credentials required for login with username, password, and optional TOTP.
 */
export interface ILoginTotpCredentials {
	username: string;
	password: string;
	totpSecret?: string;
}

/**
 * Type guard to check if the credentials object conforms to ILoginTotpCredentials.
 * @param obj The credentials object to check
 * @returns True if the object is ILoginTotpCredentials, false otherwise
 */
export function isILoginTotpCredentials(
	obj: ICredentials,
): obj is ICredentials & ILoginTotpCredentials {
	return (
		'username' in obj &&
		typeof obj.username === 'string' &&
		obj.username.trim() !== '' &&
		'password' in obj &&
		typeof obj.password === 'string' &&
		obj.password.trim() !== ''
	);
}

/**
 * The structure of a successful login response from the Tanss API.
 * @see https://api-doc.tanss.de/#tag/security/paths/~1api~1v1~1login/post
 */
export interface ISuccessLoginResponse {
	content: {
		employeeId: number;
		apiKey: string;
		expire: number;
		refresh: string;
		employeeType: string;
	};
}

/**
 * The structure of an unsuccessful login response from the Tanss API.
 * @see https://api-doc.tanss.de/#tag/security/paths/~1api~1v1~1login/post
 */
export interface IUnsuccessfulLoginResponse {
	content: {
		detailMessage: string;
	};
}
