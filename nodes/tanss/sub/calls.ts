import { IExecuteFunctions, INodeProperties, NodeOperationError, IDataObject } from 'n8n-workflow';

export const callsOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options' as const,
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['calls'],
            },
        },
        options: [
            {
                name: 'Create / Import Call',
                value: 'createCall',
                description: 'Creates/imports a phone call into the database',
                action: 'Create call',
            },
        ],
        default: 'createCall',
    },
];

export const callsFields: INodeProperties[] = [
    {
        displayName: 'API Token',
        name: 'apiToken',
        type: 'string' as const,
        required: true,
        typeOptions: { password: true },
        default: '',
        description: 'API token obtained from the TANSS API login',
        displayOptions: {
            show: {
                resource: ['calls'],
            },
        },
    },
    {
        displayName: 'Use Raw Call JSON (Optional)',
        name: 'callJson',
        type: 'string' as const,
        default: '',
        description: 'If provided (valid JSON), this object will be posted as-is. Otherwise the fields below / collection are used to build the payload.',
        displayOptions: {
            show: {
                resource: ['calls'],
                operation: ['createCall'],
            },
        },
    },

    {
        displayName: 'Create Call Fields',
        name: 'createCallFields',
        type: 'collection' as const,
        placeholder: 'Add Field',
        displayOptions: {
            show: {
                resource: ['calls'],
                operation: ['createCall'],
            },
        },
        default: {},
        options: [
            { displayName: 'Date (Timestamp)', name: 'date', type: 'number' as const, default: 0, description: 'Unix timestamp representing the begin of the phone call', required: true },
            { displayName: 'From Phone Number', name: 'fromPhoneNumber', type: 'string' as const, default: '', description: 'Phone number (or identifier) of the caller', required: true },
            { displayName: 'To Phone Number', name: 'toPhoneNumber', type: 'string' as const, default: '', description: 'Phone number (or identifier) of the called party', required: true },
            {
                displayName: 'Direction',
                name: 'direction',
                type: 'options' as const,
                options: [
                    { name: 'INTERNAL', value: 'INTERNAL' },
                    { name: 'INCOMING', value: 'INCOMING' },
                    { name: 'OUTGOING', value: 'OUTGOING' },
                ],
                default: 'INTERNAL',
                description: 'Defines the direction of the call',
                required: true,
            },
            { displayName: 'callId', name: 'callId', type: 'string' as const, default: '', description: 'External ID of the phone call' },
            { displayName: 'telephoneSystemId', name: 'telephoneSystemId', type: 'number' as const, default: 0 },
            { displayName: 'fromCompanyId', name: 'fromCompanyId', type: 'number' as const, default: 0 },
            { displayName: 'fromCompanyPercent', name: 'fromCompanyPercent', type: 'number' as const, default: 0 },
            { displayName: 'fromEmployeeId', name: 'fromEmployeeId', type: 'number' as const, default: 0 },
            { displayName: 'toCompanyId', name: 'toCompanyId', type: 'number' as const, default: 0 },
            { displayName: 'toCompanyPercent', name: 'toCompanyPercent', type: 'number' as const, default: 0 },
            { displayName: 'toEmployeeId', name: 'toEmployeeId', type: 'number' as const, default: 0 },
            { displayName: 'connectionEstablished', name: 'connectionEstablished', type: 'boolean' as const, default: false },
            { displayName: 'durationTotal (Seconds)', name: 'durationTotal', type: 'number' as const, default: 0 },
            { displayName: 'durationCall (Seconds)', name: 'durationCall', type: 'number' as const, default: 0 },
            { displayName: 'Group', name: 'group', type: 'string' as const, default: '' },
            { displayName: 'numberIdentifyState', name: 'numberIdentifyState', type: 'string' as const, default: '' },

            // phoneParticipants: either JSON or collection entry
            {
                displayName: 'Phone Participants JSON',
                name: 'phoneParticipantsJson',
                type: 'string' as const,
                default: '',
                description: 'JSON array of phone participant objects. If provided, this will be used.',
            },
            {
                displayName: 'Phone Participants (Collection)',
                name: 'phoneParticipants',
                type: 'fixedCollection' as const,
                placeholder: 'Add participant',
                typeOptions: { multipleValues: true },
                default: {},
                options: [
                    {
                        displayName: 'Participant',
                        name: 'participant',
                        values: [
                            { displayName: 'idString', name: 'idString', type: 'string' as const, default: '' },
                            { displayName: 'employeeId', name: 'employeeId', type: 'number' as const, default: 0 },
                        ],
                    },
                ],
            },
        ],
    },
];

export async function handleCalls(this: IExecuteFunctions, i: number) {
    const operation = this.getNodeParameter('operation', i) as string;
    if (operation !== 'createCall') {
        throw new NodeOperationError(this.getNode(), `Operation "${operation}" not supported by Calls.`);
    }

    const credentials = await this.getCredentials('tanssApi');
    if (!credentials) throw new NodeOperationError(this.getNode(), 'No credentials returned!');

    const apiToken = this.getNodeParameter('apiToken', i, '') as string;
    const typedCredentials = credentials as { baseURL?: string };
    const baseURL = typedCredentials.baseURL;
    if (!baseURL) throw new NodeOperationError(this.getNode(), 'No baseURL in credentials');

    const callJson = this.getNodeParameter('callJson', i, '') as string;

    let body: IDataObject = {};

    // Priority: callJson (raw) > createCallFields collection > individual fields
    if (callJson && callJson.trim() !== '') {
        try {
            const parsed = JSON.parse(callJson);
            if (typeof parsed !== 'object' || parsed === null) {
                throw new Error('callJson must be an object');
            }
            body = parsed as IDataObject;
        } catch {
            throw new NodeOperationError(this.getNode(), 'callJson must be valid JSON object.');
        }
    } else {
        const createCallFields = this.getNodeParameter('createCallFields', i, {}) as IDataObject;
        if (createCallFields && Object.keys(createCallFields).length > 0) {
            Object.assign(body, createCallFields);

            if (createCallFields.phoneParticipants && typeof createCallFields.phoneParticipants === 'object' && 'participant' in (createCallFields.phoneParticipants as Record<string, unknown>)) {
                const parts = ((createCallFields.phoneParticipants as Record<string, unknown>).participant as unknown) as Array<{ idString?: string; employeeId?: number }>;
                const list = parts.map((p) => {
                    const obj: IDataObject = {};
                    if (p.idString) obj.idString = p.idString;
                    if (p.employeeId && p.employeeId > 0) obj.employeeId = p.employeeId;
                    return obj;
                });
                body.phoneParticipants = list;
            }

            if (createCallFields.phoneParticipantsJson && typeof createCallFields.phoneParticipantsJson === 'string' && createCallFields.phoneParticipantsJson.trim() !== '') {
                try {
                    const parsed = JSON.parse(createCallFields.phoneParticipantsJson as string);
                    if (Array.isArray(parsed)) body.phoneParticipants = parsed;
                } catch {
                    throw new NodeOperationError(this.getNode(), 'createCallFields.phoneParticipantsJson must be valid JSON array.');
                }
            }
        } else {
            const optionalString = (name: string) => {
                const v = this.getNodeParameter(name, i, '') as string;
                return v === '' ? undefined : v;
            };
            const optionalNumber = (name: string) => {
                const v = this.getNodeParameter(name, i, 0) as number;
                return v === 0 ? undefined : v;
            };
            const optionalBoolean = (name: string) => {
                return this.getNodeParameter(name, i, false) as boolean;
            };

            const callId = optionalString('callId');
            const telephoneSystemId = optionalNumber('telephoneSystemId');
            const date = optionalNumber('date');
            const fromPhoneNumber = optionalString('fromPhoneNumber');
            const fromCompanyId = optionalNumber('fromCompanyId');
            const fromCompanyPercent = optionalNumber('fromCompanyPercent');
            const fromEmployeeId = optionalNumber('fromEmployeeId');
            const toPhoneNumber = optionalString('toPhoneNumber');
            const toCompanyId = optionalNumber('toCompanyId');
            const toCompanyPercent = optionalNumber('toCompanyPercent');
            const toEmployeeId = optionalNumber('toEmployeeId');
            const direction = this.getNodeParameter('direction', i, '') as string;
            const connectionEstablished = optionalBoolean('connectionEstablished');
            const durationTotal = optionalNumber('durationTotal');
            const durationCall = optionalNumber('durationCall');
            const group = optionalString('group');
            const numberIdentifyState = optionalString('numberIdentifyState');

            if (callId !== undefined) body.callId = callId;
            if (telephoneSystemId !== undefined) body.telephoneSystemId = telephoneSystemId;
            if (date !== undefined) body.date = date;
            if (fromPhoneNumber !== undefined) body.fromPhoneNumber = fromPhoneNumber;
            if (fromCompanyId !== undefined) body.fromCompanyId = fromCompanyId;
            if (fromCompanyPercent !== undefined) body.fromCompanyPercent = fromCompanyPercent;
            if (fromEmployeeId !== undefined) body.fromEmployeeId = fromEmployeeId;
            if (toPhoneNumber !== undefined) body.toPhoneNumber = toPhoneNumber;
            if (toCompanyId !== undefined) body.toCompanyId = toCompanyId;
            if (toCompanyPercent !== undefined) body.toCompanyPercent = toCompanyPercent;
            if (toEmployeeId !== undefined) body.toEmployeeId = toEmployeeId;
            if (direction) body.direction = direction;
            body.connectionEstablished = connectionEstablished;
            if (durationTotal !== undefined) body.durationTotal = durationTotal;
            if (durationCall !== undefined) body.durationCall = durationCall;
            if (group !== undefined) body.group = group;
            if (numberIdentifyState !== undefined) body.numberIdentifyState = numberIdentifyState;

            const participantsJson = this.getNodeParameter('phoneParticipantsJson', i, '') as string;
            if (participantsJson && participantsJson.trim() !== '') {
                try {
                    const parsed = JSON.parse(participantsJson);
                    if (!Array.isArray(parsed)) throw new Error('phoneParticipantsJson must be an array');
                    body.phoneParticipants = parsed;
                } catch {
                    throw new NodeOperationError(this.getNode(), 'phoneParticipantsJson must be valid JSON array.');
                }
            } else {
                const parts = this.getNodeParameter('phoneParticipants', i, { participant: [] }) as { participant?: Array<{ idString?: string; employeeId?: number }> };
                const list = (parts.participant ?? []).map(p => {
                    const obj: IDataObject = {};
                    if (p.idString) obj.idString = p.idString;
                    if (p.employeeId && p.employeeId > 0) obj.employeeId = p.employeeId;
                    return obj;
                }).filter(Boolean);
                if (list.length) body.phoneParticipants = list;
            }
        }
    }

    const url = `${baseURL}/api/calls/v1`;
    const requestOptions: IDataObject = {
        method: 'POST',
        url,
        headers: { apiToken, 'Content-Type': 'application/json' },
        body,
        json: true,
    };

    try {
        const response = await this.helpers.request(requestOptions);
        return response;
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        throw new NodeOperationError(this.getNode(), `Failed to create/import call: ${message}`);
    }
}