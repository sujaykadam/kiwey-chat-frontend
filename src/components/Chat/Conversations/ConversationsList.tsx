import { Box, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useState } from "react";
import ConversationModal from "./Modal/Modal";

interface ConversationsListProps {
	session: Session;
}

const ConversationsList:React.FC<ConversationsListProps> = ({session}) => {
	const [isOpen, setIsOpen] = useState(false);

	const onOpen = () => setIsOpen(true);
	const onClose = () => setIsOpen(false);

	return (
		<Box>
			<Box py={2} px={4} mb={4} bg='blackAlpha.200' borderRadius={4} cursor="pointer" onClick={onOpen}>
				<Text textAlign="center" color="whiteAlpha.800" fontWeight={500}>
					Find or start a Conversation
				</Text>
			</Box>
			<ConversationModal isOpen={isOpen} onClose={onClose} />
		</Box>
	);
}

export default ConversationsList;