import { gql } from "@apollo/client";
import { MessageFields } from "./message";

const ConversationFields = `
	id
	participants {
		user {
			id
			username
		}
		hasSeenLatestMessage
	}
	lastMessage{
		${MessageFields}
	}
	updatedAt
`;

const conversationOperations = {
	Queries: {
		conversations: gql`
			query Conversations {
				conversations {
					${ConversationFields}
				}
			}
		`,
	},
	Mutations: {
		createConversation: gql`
			mutation CreateConversation($participantIds: [String]!) {
				createConversation(participantIds: $participantIds) {
					conversationId
				}
			}
		`,
	},
	Subscriptions: {
		conversationCreated: gql`
			subscription ConversationCreated {
				conversationCreated {
					${ConversationFields}
				}
			}
		`,
	},
};

export default conversationOperations;
