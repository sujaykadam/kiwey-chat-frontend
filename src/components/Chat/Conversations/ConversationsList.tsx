import { Box, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useState } from "react";
import {
	ConversationPopulated,
	participantPopulated,
} from "../../../../kiwey-chat-backend/src/util/types";
import ConversationItem from "./ConversationItem";
import ConversationModal from "./Modal/ConversationModal";

interface ConversationsListProps {
	session: Session;
	conversations: Array<ConversationPopulated> | null;
	onViewConversation: (
		conversationId: string,
		hasSeenLatestMessage: boolean
	) => void;
}

const ConversationsList: React.FC<ConversationsListProps> = ({
	session,
	conversations,
	onViewConversation,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();

	const onOpen = () => setIsOpen(true);
	const onClose = () => setIsOpen(false);

	return (
		<Box width="100%">
			<Box
				py={2}
				px={4}
				mb={4}
				bg="blackAlpha.200"
				borderRadius={4}
				cursor="pointer"
				onClick={onOpen}
			>
				<Text textAlign="center" color="whiteAlpha.800" fontWeight={500}>
					Find or start a Conversation
				</Text>
			</Box>
			<ConversationModal isOpen={isOpen} onClose={onClose} session={session} />

			{conversations?.map((conversation) => {
				const hasSeenLatestMessage = !!conversation.participants.find(
					(participant: participantPopulated) =>
						participant.user.id === session.user.id
				)?.hasSeenLatestMessage;
				return (
					<ConversationItem
						key={conversation.id}
						conversation={conversation}
						onClick={() =>
							onViewConversation(conversation.id, hasSeenLatestMessage)
						}
						isSelected={conversation.id === router.query.conversationId}
						userId={session.user.id}
						hasSeenLatestMessage={hasSeenLatestMessage}
					/>
				);
			})}
		</Box>
	);
};

export default ConversationsList;
