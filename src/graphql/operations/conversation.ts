import { gql } from "@apollo/client";

const conversationFields = `
	conversations {
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
	}
`;

const conversationOperations = {
	Queries: {
		conversations: gql`
			query Conversations {
				${conversationFields}
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
