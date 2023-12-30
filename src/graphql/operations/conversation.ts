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
