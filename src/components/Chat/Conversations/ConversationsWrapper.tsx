import { useQuery } from "@apollo/client";
import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useEffect } from "react";
import { ConversationPopulated } from "../../../../kiwey-chat-backend/src/util/types";
import ConversationOperations from "../../../graphql/operations/conversation";
import { ConversationsData } from "../../../util/types";
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
		<Box width={{ base: "100%", md: "400px" }} bg="whiteAlpha.50" py={6} px={3}>
			{/* Skeleton loader */}
			<ConversationsList
				session={session}
				conversations={conversationsData?.conversations || null}
			/>
		</Box>
	);
};

export default ConversationsWrapper;
