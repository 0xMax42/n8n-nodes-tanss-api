import { IExecuteFunctions, IHttpRequestOptions, NodeOperationError } from 'n8n-workflow';
import { generateAPIEndpointURL } from './utils';
import { generateTOTP } from './2fa';

interface ICredentials {
	baseURL: string;
	authentication: string;
	username?: string;
	password?: string;
	apiToken?: string;
	totpSecret?: string;
}

/**
 * Obtains an API token based on the provided credentials.
 * If the 'whichKeyType' is provided, it ensures the correct type of token is retrieved.
 * @param executeFunctions The execution functions context
 * @param credentials The credentials object containing authentication details
 * @param whichKeyType (Optional) Specifies whether to obtain a 'system' or 'user' API token
 * @returns A promise that resolves to the obtained API token
 * @throws The {@link NodeOperationError} exception is thrown
 * - if no credentials are provided,
 * - if the required fields for the selected authentication method are missing,
 * - if the login attempt fails or the API key is not found in the response,
 * - if an unsupported authentication method is specified,
 * - if the requested key type is not available for the selected authentication method.
 */
export async function obtainToken(
	executeFunctions: IExecuteFunctions,
	credentials?: ICredentials | unknown,
	whichKeyType?: 'system' | 'user',
): Promise<string> {
	if (!credentials || typeof credentials !== 'object') {
		throw new NodeOperationError(executeFunctions.getNode(), 'No credentials provided!');
	}

	const { baseURL, authentication, username, password, apiToken, totpSecret } =
		credentials as Partial<ICredentials>;

	if (authentication === 'apiToken') {
		if (whichKeyType && whichKeyType === 'user') {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				'For this operation, a user API token is required, but only system API token is available.',
			);
		}
		if (!apiToken) {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				'API Token is required for apiToken authentication but not provided.',
			);
		}

		return Promise.resolve(apiToken);
	} else if (authentication === 'loginTotp') {
		if (whichKeyType && whichKeyType === 'system') {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				'For this operation, a system API token is required, but only user API token is available.',
			);
		}

		if (!username || !password) {
			throw new NodeOperationError(
				executeFunctions.getNode(),
				'Username and Password are required for loginTotp authentication but not provided.',
			);
		}

		const url = generateAPIEndpointURL(executeFunctions, baseURL, 'login');

		const body: { username: string; password: string; token?: string } = {
			username,
			password,
			token: totpSecret ? generateTOTP(totpSecret) : undefined,
		};

		const requestOptions: IHttpRequestOptions = {
			method: 'POST',
			url,
			body,
			json: true,
			headers: {
				'Content-Type': 'application/json',
			},
		};

		try {
			const responseData = await executeFunctions.helpers.httpRequest(requestOptions);

			if (responseData && responseData.content && responseData.content.apiKey) {
				return responseData.content.apiKey;
			} else {
				throw new NodeOperationError(
					executeFunctions.getNode(),
					'API Key not found in login response.',
				);
			}
		} catch (e: unknown) {
			const errorMessage = e instanceof Error ? e.message : String(e);
			throw new NodeOperationError(executeFunctions.getNode(), `Login failed: ${errorMessage}`);
		}
	} else {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			`Unsupported authentication method: ${authentication}`,
		);
	}
}

/**
 * Normalizes the provided token by ensuring it starts with 'Bearer '
 * for proper authorization header formatting.
 * @param token The API token to normalize
 * @returns The normalized token string
 */
function normalizeToken(token: string): string {
	if (String(token).startsWith('Bearer ')) {
		return String(token);
	}
	return `Bearer ${String(token)}`;
}

/**
 * Adds the Authorization header to the provided request options.
 * @param requestOptions The HTTP request options to which the Authorization header will be added
 * @param token The API token to be used for authorization
 * @returns void; The requestOptions object is modified in place
 */
export function addAuthorizationHeader(requestOptions: IHttpRequestOptions, token: string): void {
	const normalizedToken = normalizeToken(token);
	if (!requestOptions.headers) {
		requestOptions.headers = {};
	}
	requestOptions.headers.Authorization = normalizedToken;
	requestOptions.headers.apiToken = normalizedToken;
}
