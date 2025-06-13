import { Variable } from '../hooks/use-contract-project';

export interface VariableField {
	variableName: string;
	fieldId: string;
	title: string;
	choices?: string[];
	type?: string;
}

export const variableFields: VariableField[] = [
	{
		variableName: '__USERFULLNAME__',
		fieldId: 'userFullName',
		title: 'Author full name',
	},
	{
		variableName: '__USEREMAIL__',
		fieldId: 'userEmail',
		title: 'Author email',
	},
	{
		variableName: '__MODULENAME__',
		fieldId: 'moduleName',
		title: 'Module name',
	},
	{
		variableName: '__MODULEDESC__',
		fieldId: 'moduleDesc',
		title: 'Module description',
	},
	{
		variableName: '__REPONAME__',
		fieldId: 'repoName',
		title: 'Repository name',
	},
	{
		variableName: '__USERNAME__',
		fieldId: 'username',
		title: 'GitHub username',
	},
	{
		variableName: '__ACCESS__',
		fieldId: 'access',
		title: 'Access',
		choices: ['public', 'restricted'],
		type: 'list',
	},
];

export const fallbackVariables: Variable[] = variableFields.map((field) => ({
	name: field.variableName,
	message: field.title,
	required: true,
}));
