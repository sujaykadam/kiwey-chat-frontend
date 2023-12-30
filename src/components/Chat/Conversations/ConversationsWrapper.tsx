import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { Box, Stack } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useEffect } from "react";
import {
	ConversationPopulated,
	participantPopulated,
} from "../../../../kiwey-chat-backend/src/util/types";
import ConversationOperations from "../../../graphql/operations/conversation";
import {
	ConversationsData,
	ConversationsUpdatedData,
} from "../../../util/types";
import SkeletonLoader from "../../common/SkeletonLoader";
import ConversationsList from "./ConversationsList";
interface ConversationsWrapperProps {
	session: Session;
}

const ConversationsWrapper: React.FC<ConversationsWrapperProps> = ({
	session,
}) => {
	const {
		data: conversationsData,
		error: conversationsError,
		loading: conversationsLoading,
		subscribeToMore: subscribeToMoreConversations,
	} = useQuery<ConversationsData>(ConversationOperations.Queries.conversations);

	const [markConversationAsRead] = useMutation<
		{ markConversationAsRead: Boolean },
		{ conversationId: String; userId: String }
	>(ConversationOperations.Mutations.markConversationAsRead);

	useSubscription<ConversationsUpdatedData>(
		ConversationOperations.Subscriptions.conversationUpdated,
		{
			onData: ({ client, data }) => {
				const { data: subscriptionData } = data;
				console.log("subscriptionData", subscriptionData);
				if (!subscriptionData) return;
			},
		}
	);

	const router = useRouter();
	const { conversationId } = router.query;

	const onViewConversation = async (
		conversationId: string,
		hasSeenLatestMessage: boolean
	) => {
		router.push({ query: { conversationId } });
		if (hasSeenLatestMessage) return;
		//mark conversation read
		try {
			await markConversationAsRead({
				variables: {
					userId: session.user.id,
					conversationId,
				},
				optimisticResponse: {
					markConversationAsRead: true,
				},
				update: (cache) => {
					/**
					 * Get conversation participants from cache
					 */
					const participantsFragment = cache.readFragment<{
						participants: Array<participantPopulated>;
					}>({
						id: `Conversation:${conversationId}`,
						fragment: ConversationOperations.Fragments.getParticipants,
					});

					if (!participantsFragment) return;

					const participants = [...participantsFragment.participants];

					const userParticipantIdx = participants.findIndex(
						(p) => p.user.id === session.user.id
					);

					if (userParticipantIdx === -1) return;

					const userParticipant = participants[userParticipantIdx];

					/**
					 * Update participant to show latest message as read
					 */
					participants[userParticipantIdx] = {
						...userParticipant,
						hasSeenLatestMessage: true,
					};

					/**
					 * Update cache
					 */
					cache.writeFragment({
						id: `Conversation:${conversationId}`,
						fragment: ConversationOperations.Fragments.updateParticipants,
						data: {
							participants,
						},
					});
				},
			});
		} catch (error) {
			console.log("onViewConversation error", error);
		}
	};

	const subscribeToNewConversations = () => {
		subscribeToMoreConversations({
			document: ConversationOperations.Subscriptions.conversationCreated,
			updateQuery: (
				prev,
				{
					subscriptionData,
				}: {
					subscriptionData: {
						data: { conversationCreated: ConversationPopulated };
					};
				}
			) => {
				if (!subscriptionData?.data) return prev;

				const newConversation = subscriptionData.data.conversationCreated;
				return Object.assign({}, prev, {
					conversations: [newConversation, ...prev.conversations],
				});
			},
		});
	};

	useEffect(() => {
		subscribeToNewConversations();
	}, []);

	return (
		<Box
			width={{ base: "100%", md: "400px" }}
			bg="whiteAlpha.50"
			py={6}
			px={3}
			display={{ base: conversationId ? "none" : "flex", md: "flex" }}
		>
			{conversationsLoading ? (
				<Stack spacing={4} width="100%">
					<SkeletonLoader
						count={conversationsData?.conversations.length || 3}
						height="80px"
						width="100%"
					/>
				</Stack>
			) : (
				<ConversationsList
					session={session}
					conversations={conversationsData?.conversations || null}
					onViewConversation={onViewConversation}
				/>
			)}
		</Box>
	);
};

export default ConversationsWrapper;
