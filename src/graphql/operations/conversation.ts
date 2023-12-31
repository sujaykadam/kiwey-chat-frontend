import { gql } from "@apollo/client";
import { MessageFields } from "./message";

export const ConversationFields = `
	id
	participants {
		user {
			id
			username
		}
		hasSeenLatestMessage
	}
	latestMessage{
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
		markConversationAsRead: gql`
			mutation MarkConversationAsRead(
				$conversationId: String!
				$userId: String!
			) {
				markConversationAsRead(conversationId: $conversationId, userId: $userId)
			}
		`,
		deleteConversation: gql`
			mutation DeleteConversation($conversationId: String!) {
				deleteConversation(conversationId: $conversationId)
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
		conversationUpdated: gql`
			subscription ConversationUpdated {
				conversationUpdated {
					conversation {
						${ConversationFields}
					}
				}
			}
		`,
		conversationDeleted: gql`
			subscription ConversationDeleted {
				conversationDeleted {
					conversationId
				}
			}
		`,
	},
	Fragments: {
		getParticipants: gql`
			fragment Participants on Conversation {
				participants {
					user {
						id
						username
					}
					hasSeenLatestMessage
				}
			}
		`,
		updateParticipants: gql`
			fragment UpdatedParticipant on Conversation {
				participants
			}
		`,
	},
};

export default conversationOperations;
