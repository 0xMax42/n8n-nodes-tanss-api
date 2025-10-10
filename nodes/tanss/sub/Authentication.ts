import {
	IExecuteFunctions,
	IHttpRequestMethods,
	INodeProperties,
	NodeOperationError,
} from 'n8n-workflow';

export const authOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['authentication'],
			},
		},
		options: [
			{
				name: 'Login',
				value: 'login',
				description: 'Login to the TANSS API',
				action: 'Login to the TANSS API',
			},
		],
		default: 'login',
	},
];

export const authFields: INodeProperties[] = [];

export async function handleAuth(this: IExecuteFunctions, i: number) {
	const operation = this.getNodeParameter('operation', i) as string;
	const credentials = await this.getCredentials('tanssApi');

	if (!credentials) {
		throw new NodeOperationError(this.getNode(), 'No credentials returned!');
	}

	const baseURL = (credentials.baseURL as string).replace(/\/+$/, '');
	const username = credentials.username as string;
	const password = credentials.password as string;

	const url = `${baseURL}/backend/api/v1/login`;

	if (operation === 'login') {
		const requestOptions = {
			method: 'POST' as IHttpRequestMethods,
			url,
			body: { username, password },
			json: true,
		};

		try {
			const responseData = await this.helpers.request(requestOptions);
			return responseData;
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			throw new NodeOperationError(this.getNode(), `Login failed: ${errorMessage}`);
		}
	}

	throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not recognized.`);
}
