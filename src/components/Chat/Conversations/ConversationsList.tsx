import { useMutation } from "@apollo/client";
import { Box, Button, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import {
	ConversationPopulated,
	participantPopulated,
} from "../../../../kiwey-chat-backend/src/util/types";
import conversationOperations from "../../../graphql/operations/conversation";
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
	const [deleteConversation] = useMutation<{
		deleteConversation: boolean;
		conversationId: string;
	}>(conversationOperations.Mutations.deleteConversation);
	const router = useRouter();

	const onOpen = () => setIsOpen(true);
	const onClose = () => setIsOpen(false);
	const sortedConversations = [...(conversations || [])].sort(
		(conversation1, conversation2) =>
			new Date(conversation2.updatedAt.valueOf()).getTime() -
			new Date(conversation1.updatedAt.valueOf()).getTime()
	);
	const onDeleteConversation = async (conversationId: string) => {
		try {
			toast.promise(
				deleteConversation({
					variables: {
						conversationId,
					},
					update: () => {
						router.replace(
							typeof process.env.NEXT_PUBLIC_BASE_URL === "string"
								? process.env.NEXT_PUBLIC_BASE_URL
								: ""
						);
					},
				}),
				{
					loading: "Deleting conversation",
					success: "Conversation deleted",
					error: "Failed to delete conversation",
				}
			);
		} catch (error) {
			console.log("onDeleteConversation error", error);
		}
	};

	return (
		<Box width={{ base: "calc(100vw - 24px)", md: "calc(25vw - 24px)" }}>
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

			{sortedConversations?.map((conversation) => {
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
						onDeleteConversation={onDeleteConversation}
					/>
				);
			})}
			<Button
				position="absolute"
				bottom={3}
				left={3}
				width={{ base: "calc(100vw - 24px)", md: "calc(25vw - 24px)" }}
				onClick={() => signOut()}
			>
				Logout
			</Button>
		</Box>
	);
};

export default ConversationsList;
