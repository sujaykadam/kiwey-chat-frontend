import { useQuery } from "@apollo/client";
import { Flex } from "@chakra-ui/react";
import toast from "react-hot-toast";
import MessageOperations from "../../../../graphql/operations/message";
import { MessagesData, MessagesVariables } from "../../../../util/types";
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

	return (
		<Flex direction="column" justify="flex-end" overflow="hidden">
			{messagesLoading && <div>Loading...</div>}
			{messagesData?.messages && (
				<Flex direction="column-reverse" height="100%" overflowY="scroll">
					{/* {messagesData.messages.map((message) => (
						<MessageItem key={message.id} message={message} userId={userId} />
					))} */}
				</Flex>
			)}
		</Flex>
	);
};

export default Messages;
