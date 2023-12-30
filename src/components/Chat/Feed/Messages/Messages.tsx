import { useQuery } from "@apollo/client";
import { Flex, Stack } from "@chakra-ui/react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import MessageOperations from "../../../../graphql/operations/message";
import {
	MessageSubscriptionData,
	MessagesData,
	MessagesVariables,
} from "../../../../util/types";
import SkeletonLoader from "../../../common/SkeletonLoader";
import MessageItem from "./MessageItem";
interface MessagesProps {
	userId: string;
	conversationId: string;
}

const Messages: React.FunctionComponent<MessagesProps> = ({
	userId,
	conversationId,
}) => {
	const {
		data: messagesData,
		loading: messagesLoading,
		error: messagesError,
		subscribeToMore,
	} = useQuery<MessagesData, MessagesVariables>(
		MessageOperations.Query.messages,
		{
			variables: {
				conversationId,
			},
			onError: ({ message }) => {
				toast.error(message || "An error occurred");
			},
		}
	);

	const subscribeToMoreMessages = (conversationId: String) => {
		subscribeToMore({
			document: MessageOperations.Subscription.messageSent,
			variables: { conversationId },
			updateQuery: (prev, { subscriptionData }: MessageSubscriptionData) => {
				if (!subscriptionData.data) return prev;

				const newMessage = subscriptionData.data.messageSent || {};
				return Object.assign({}, prev, {
					messages:
						userId === newMessage.sender.id
							? prev.messages
							: [newMessage, ...prev.messages],
				});
			},
		});
	};

	useEffect(() => {
		subscribeToMoreMessages(conversationId);
	}, [conversationId]);

	if (messagesError) {
		return null;
	}

	return (
		<Flex
			direction="column"
			justify="flex-end"
			height={{ base: "calc(100vh - 168px)", md: "calc(100vh - 152px)" }}
		>
			{messagesLoading && (
				<Stack spacing={4} height="min-content">
					<SkeletonLoader count={4} height="80px" />
				</Stack>
			)}
			{messagesData?.messages && (
				<Flex
					direction="column-reverse"
					width="100%"
					gap={6}
					height="100vh"
					overflowY="auto"
				>
					{messagesData.messages.map((message) => (
						<MessageItem
							key={message.id}
							message={message}
							sentByMe={userId === message.sender.id}
						/>
					))}
				</Flex>
			)}
		</Flex>
	);
};

export default Messages;
