import {
	INodeType,
	INodeTypeDescription,
	IExecuteFunctions,
	NodeOperationError,
} from 'n8n-workflow';
import {
	availabilityFields,
	availabilityOperations,
	callbackFields,
	callbackOperations,
	callsFields,
	callsOperations,
	callsUserFields,
	callsUserOperations,
	cpuFields,
	cpuOperations,
	employeesFields,
	employeesOperations,
	handleAvailability,
	handleCallback,
	handleCalls,
	handleCallsUser,
	handleCpu,
	handleEmployees,
	handleHddTypes,
	handleIps,
	handleMails,
	handleManufacturers,
	handleOperatingSystems,
	handlePc,
	handleRemoteSupports,
	handleTicket,
	handleTicketContent,
	handleTicketList,
	handleTicketStates,
	handleTimestamps,
	hddTypesFields,
	hddTypesOperations,
	ipsFields,
	ipsOperations,
	mailsFields,
	mailsOperations,
	manufacturersFields,
	manufacturersOperations,
	operatingSystemsFields,
	operatingSystemsOperations,
	pcFields,
	pcOperations,
	remoteSupportsFields,
	remoteSupportsOperations,
	ticketContentFields,
	ticketContentOperations,
	ticketFields,
	ticketListFields,
	ticketListOperations,
	ticketOperations,
	ticketStatesFields,
	ticketStatesOperations,
	timestampFields,
	timestampOperations,
	checklistFields,
	checklistOperations,
	handleChecklist,
} from './sub';

export class Tanss implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TANSS',
		name: 'tanss',
		icon: 'file:../../icons/tanss.svg',
		group: ['transform'],
		version: 1,
		description: 'Interact with the TANSS API',
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		defaults: {
			name: 'TANSS',
		},
		inputs: ['main'],
		outputs: ['main'],
		usableAsTool: true,

		credentials: [
			{
				name: 'tanssApi',
				required: true,
			},
		],

		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Availability', value: 'availability' },
					{ name: 'Call', value: 'calls' },
					{ name: 'Call User', value: 'callsuser' },
					{ name: 'Callback', value: 'callback' },
					{ name: 'Checklist', value: 'checklist' },
					{ name: 'CPU', value: 'cpus' },
					{ name: 'Employee', value: 'employees' },
					{ name: 'HDD Type', value: 'hddTypes' },
					{ name: 'IP Address', value: 'ips' },
					{ name: 'Mail', value: 'mails' },
					{ name: 'Manufacturer', value: 'manufacturers' },
					{ name: 'Operating System', value: 'operatingSystems' },
					{ name: 'PC', value: 'pc' },
					{ name: 'Remote Support', value: 'remoteSupports' },
					{ name: 'Ticket', value: 'ticket' },
					{ name: 'Ticket Content', value: 'ticketContent' },
					{ name: 'Ticket List', value: 'ticketList' },
					{ name: 'Ticket State', value: 'ticketStates' },
					{ name: 'Timestamp', value: 'timestamps' },
				],
				default: 'availability',
				description: 'Select which TANSS API resource to interact with',
			},

			...pcOperations,
			...pcFields,
			...ticketOperations,
			...ticketFields,
			...ticketContentOperations,
			...ticketContentFields,
			...ticketListOperations,
			...ticketListFields,
			...ticketStatesOperations,
			...ticketStatesFields,
			...timestampOperations,
			...timestampFields,
			...availabilityOperations,
			...availabilityFields,
			...employeesOperations,
			...employeesFields,
			...mailsOperations,
			...mailsFields,
			...callsOperations,
			...callsFields,
			...callsUserOperations,
			...callsUserFields,
			...cpuOperations,
			...cpuFields,
			...hddTypesOperations,
			...hddTypesFields,
			...manufacturersOperations,
			...manufacturersFields,
			...operatingSystemsOperations,
			...operatingSystemsFields,
			...remoteSupportsOperations,
			...remoteSupportsFields,
			...ipsOperations,
			...ipsFields,
			...callbackOperations,
			...callbackFields,
			...checklistOperations,
			...checklistFields,
		],
	};

	async execute(this: IExecuteFunctions) {
		const items = this.getInputData();
		const returnData = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			let responseData;
			if (resource === 'pc') responseData = await handlePc.call(this, i);
			else if (resource === 'cpus') responseData = await handleCpu.call(this, i);
			else if (resource === 'ticket') responseData = await handleTicket.call(this, i);
			else if (resource === 'ticketContent') responseData = await handleTicketContent.call(this, i);
			else if (resource === 'ticketList') responseData = await handleTicketList.call(this, i);
			else if (resource === 'ticketStates') responseData = await handleTicketStates.call(this, i);
			else if (resource === 'timestamps') responseData = await handleTimestamps.call(this, i);
			else if (resource === 'calls') responseData = await handleCalls.call(this, i);
			else if (resource === 'callsuser') responseData = await handleCallsUser.call(this, i);
			else if (resource === 'employees') responseData = await handleEmployees.call(this, i);
			else if (resource === 'mails') responseData = await handleMails.call(this, i);
			else if (resource === 'remoteSupports')
				responseData = await handleRemoteSupports.call(this, i);
			else if (resource === 'availability') responseData = await handleAvailability.call(this, i);
			else if (resource === 'hddTypes') responseData = await handleHddTypes.call(this, i);
			else if (resource === 'manufacturers') responseData = await handleManufacturers.call(this, i);
			else if (resource === 'operatingSystems')
				responseData = await handleOperatingSystems.call(this, i);
			else if (resource === 'ips') responseData = await handleIps.call(this, i);
			else if (resource === 'callback') responseData = await handleCallback.call(this, i);
			else if (resource === 'checklist') responseData = await handleChecklist.call(this, i);
			else
				throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`, {
					itemIndex: i,
				});

			if (Array.isArray(responseData)) returnData.push(...responseData);
			else returnData.push(responseData);
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
