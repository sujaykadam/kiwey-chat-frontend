import { Box, Input } from "@chakra-ui/react";
import { Session } from "next-auth";
import * as React from "react";
import toast from "react-hot-toast";
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

	const onSendMessage = async (event: React.FormEvent) => {
		event.preventDefault();
		try {
			// call send message mutation
		} catch (error: any) {
			console.log("onSendMessageError", error);
			toast.error(error.message || "An error occurred");
		}
	};
	return (
		<Box px={4} py={6} width="100%">
			<Messages conversationId={conversationId} userId={session.user.id} />
			<form onSubmit={onSendMessage}>
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
