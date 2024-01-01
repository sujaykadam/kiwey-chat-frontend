import { useMutation } from "@apollo/client";
import { Box, Input } from "@chakra-ui/react";
import { ObjectID } from "bson";
import { Session } from "next-auth";
import * as React from "react";
import toast from "react-hot-toast";
import { SendMessageArguments } from "../../../../../kiwey-chat-backend/src/util/types";
import MessageOperations from "../../../../graphql/operations/message";
import { MessagesData } from "../../../../util/types";
import Messages from "./Messages";

interface MessageInputProps {
	session: Session;
	conversationId: string;
}

const MessageInput: React.FunctionComponent<MessageInputProps> = ({
	session,
	conversationId,
}) => {
	const [messageBody, setMessageBody] = React.useState("");
	const [sendMessage] = useMutation<
		{ sendMessage: boolean },
		SendMessageArguments
	>(MessageOperations.Mutation.sendMessage);
	const onSendMessage = async (event: React.FormEvent) => {
		event.preventDefault();
		try {
			// call send message mutation
			const {
				user: { id: senderId, username: senderUsername },
			} = session;

			const messageId = new ObjectID().toHexString();
			const body = messageBody.trim();
			setMessageBody("");
			const newMessage: SendMessageArguments = {
				id: messageId,
				senderId,
				conversationId,
				body,
			};
			const { data: sendMessageData, errors: sendMessageErrors } =
				await sendMessage({
					variables: { ...newMessage },
					optimisticResponse: {
						sendMessage: true,
					},
					update: (cache) => {
						const existingCache = cache.readQuery<MessagesData>({
							query: MessageOperations.Query.messages,
							variables: { conversationId },
						}) as MessagesData;
						cache.writeQuery<MessagesData, { conversationId: string }>({
							query: MessageOperations.Query.messages,
							variables: { conversationId },
							data: {
								...existingCache,
								messages: [
									{
										...newMessage,
										createdAt: new Date(Date.now()),
										updatedAt: new Date(Date.now()),
										sender: { id: senderId, username: senderUsername },
									},
									...existingCache.messages,
								],
							},
						});
					},
				});

			if (!sendMessageData?.sendMessage || sendMessageErrors?.length) {
				throw new Error(sendMessageErrors?.[0]?.message || "An error occurred");
			}
		} catch (error: any) {
			console.log("onSendMessageError", error);
			toast.error("An error occurred");
		}
	};
	return (
		<Box p={4} width="100%" height="100%">
			<Messages conversationId={conversationId} userId={session.user.id} />
			<form onSubmit={onSendMessage} style={{ marginTop: "16px" }}>
				<Input
					value={messageBody}
					size="md"
					placeholder="New message"
					_focus={{
						boxShadow: "none",
						border: "1px solid",
						borderColor: "whiteAlpha.400",
					}}
					resize={"none"}
					onChange={(event) => setMessageBody(event.target.value)}
				/>
			</form>
		</Box>
	);
};

export default MessageInput;
