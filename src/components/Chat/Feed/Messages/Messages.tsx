import { useQuery } from "@apollo/client";
import { Flex, Stack, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import MessageOperations from "../../../../graphql/operations/message";
import {
	MessageSubscriptionData,
	MessagesData,
	MessagesVariables,
} from "../../../../util/types";
import SkeletonLoader from "../../../common/SkeletonLoader";
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
	if (messagesError) {
		return null;
	}

	const subscribeToMoreMessages = (conversationId: String) => {
		subscribeToMore({
			document: MessageOperations.Subscription.messageSent,
			variables: { conversationId },
			updateQuery: (prev, { subscriptionData }: MessageSubscriptionData) => {
				if (!subscriptionData.data) return prev;

				const newMessage = subscriptionData.data.messageSent || {};
				return Object.assign({}, prev, {
					messages: [newMessage, ...prev.messages],
				});
			},
		});
	};

	useEffect(() => {
		subscribeToMoreMessages(conversationId);
	}, [conversationId]);
	console.log("message", messagesData);

	return (
		<Flex direction="column" justify="flex-end" overflow="hidden">
			{messagesLoading && (
				<Stack spacing={4} my={4} height="100%">
					<SkeletonLoader count={4} height="80px" />
				</Stack>
			)}
			{messagesData?.messages && (
				<Flex direction="column-reverse" height="100%" overflowY="scroll">
					{messagesData.messages.map((message) => (
						// <MessageItem key={message.id} message={message} userId={userId} />
						<Text key={message.id}>{message.body}</Text>
					))}
				</Flex>
			)}
		</Flex>
	);
};

export default Messages;
