import { useQuery } from "@apollo/client";
import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ConversationPopulated } from "../../../../kiwey-chat-backend/src/util/types";
import ConversationOperations from "../../../graphql/operations/conversation";
import { ConversationsData } from "../../../util/types";
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

	const router = useRouter();
	const { conversationId } = router.query;

	const onViewConversation = async (conversationId: string) => {
		router.push({ query: { conversationId } });
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
				<SkeletonLoader
					count={conversationsData?.conversations.length || 3}
					height="80px"
					width="100%"
				/>
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
