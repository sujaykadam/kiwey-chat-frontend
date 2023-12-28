import { ConversationPopulated } from "../../../kiwey-chat-backend/src/util/types";
// User Types
export interface CreateUsernameData {
	createUsername: {
		success: boolean;
		error: string | null;
	};
}

export interface CreateUsernameVariables {
	username: string;
}

export interface SearchUsersInput {
	username: string;
}
export interface SearchUsersData {
	searchUsers: Array<SearchedUser>;
}

export interface SearchedUser {
	id: string;
	username: string;
}

// Conversation Types
export interface createConversationData {
	createConversation: {
		conversationId: string;
	};
}

export interface createConversationInputs {
	participantIds: Array<string>;
}

export interface ConversationsData {
	conversations: Array<ConversationPopulated>;
}
