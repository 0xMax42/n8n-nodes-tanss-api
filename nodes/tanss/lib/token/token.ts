import { IExecuteFunctions, IHttpRequestOptions, NodeOperationError } from 'n8n-workflow';
import { generateTOTP } from '../2fa';
import { generateAPIEndpointURL } from '../utils';
import { httpRequest } from '../httpRequest/httpRequest';
import {
	AuthenticateTypeMap,
	isIApiTokenCredentials,
	isICredentials,
	isILoginTotpCredentials,
	ISuccessLoginResponse,
	IUnsuccessfulLoginResponse,
	KeyType,
} from './tokenTypes';
import { AUTH_HEADER_NAME } from './tokenConstants';

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
	credentials: unknown,
	whichKeyType?: KeyType,
): Promise<string> {
	if (!isICredentials(credentials)) {
		throw new NodeOperationError(executeFunctions.getNode(), 'No valid credentials provided!');
	}

	if (credentials.authentication === AuthenticateTypeMap.system) {
		if (whichKeyType === 'user')
			throw new NodeOperationError(
				executeFunctions.getNode(),
				'For this operation, a user API token is required, but only system API token is available.',
			);

		if (!isIApiTokenCredentials(credentials))
			throw new NodeOperationError(
				executeFunctions.getNode(),
				'API Token is required for apiToken authentication but not provided.',
			);

		return credentials.apiToken;
	} else if (credentials.authentication === AuthenticateTypeMap.user) {
		if (whichKeyType === 'system')
			throw new NodeOperationError(
				executeFunctions.getNode(),
				'For this operation, a system API token is required, but only user API token is available.',
			);

		if (!isILoginTotpCredentials(credentials))
			throw new NodeOperationError(
				executeFunctions.getNode(),
				'Username and Password are required for loginTotp authentication but not provided.',
			);

		const response = await httpRequest<ISuccessLoginResponse, IUnsuccessfulLoginResponse>(
			executeFunctions,
			{
				method: 'POST',
				url: generateAPIEndpointURL(executeFunctions, credentials.baseURL, 'login'),
				headers: {
					'Content-Type': 'application/json',
				},
				body: {
					username: credentials.username,
					password: credentials.password,
					token: credentials.totpSecret ? generateTOTP(credentials.totpSecret) : undefined,
				},
				json: true,
			},
		);

		switch (response.kind) {
			case 'success':
				return response.body.content.apiKey;

			case 'http-error':
				throw new NodeOperationError(
					executeFunctions.getNode(),
					`Login failed: ${response.body?.content.detailMessage ?? 'Unknown error during login.'}`,
				);
			case 'network-error':
				throw new NodeOperationError(executeFunctions.getNode(), `Login failed: ${response.body}`);
		}
	} else {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			`Unsupported authentication method: ${credentials.authentication}`,
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
	let t = token.trim();
	// Strip any leading "bearer" (with or without space)
	t = t.replace(/^bearer\s*/i, '').trim();
	return `Bearer ${t}`;
}

/**
 * Adds the required Authorization header ({@link AUTH_HEADER_NAME}) to the provided request options.
 * @param requestOptions The HTTP request options to which the Authorization header will be added
 * @param token The API token to be used for authorization
 * @returns void; The requestOptions object is modified in place
 */
export function addAuthorizationHeader(requestOptions: IHttpRequestOptions, token: string): void {
	const normalizedToken = normalizeToken(token);
	if (!requestOptions.headers) {
		requestOptions.headers = {};
	}
	requestOptions.headers[AUTH_HEADER_NAME] = normalizedToken;
}
