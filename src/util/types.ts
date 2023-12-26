export interface createUsernameData {
	createUsername: {
		success: boolean;
		error: string | null;
	}
}

export interface createUsernameVariables {
	username: string;
}
