import { useQuery } from "@apollo/client";
import { Flex, Stack, Text } from "@chakra-ui/react";
import toast from "react-hot-toast";
import MessageOperations from "../../../../graphql/operations/message";
import { MessagesData, MessagesVariables } from "../../../../util/types";
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
						<Text>{message.body}</Text>
					))}
				</Flex>
			)}
		</Flex>
	);
};

export default Messages;
