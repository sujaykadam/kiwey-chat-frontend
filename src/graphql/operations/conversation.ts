import { gql } from "@apollo/client";

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
		id
		sender {
			id
			username
		}
		body
		createdAt
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
	Subscriptions: {},
};

export default conversationOperations;
