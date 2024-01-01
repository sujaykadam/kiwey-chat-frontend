import { Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import MessagesHeader from "./Messages/Header";
import MessageInput from "./Messages/Input";
import NoConversation from "./NoConversationSelected";

interface FeedWrapperProps {
	session: Session;
}

const FeedWrapper: React.FC<FeedWrapperProps> = ({ session }) => {
	const router = useRouter();
	const { conversationId } = router.query as { conversationId: string };
	const {
		user: { id: userId },
	} = session;
	return (
		<Flex
			display={{ base: conversationId ? "flex" : "none", md: "flex" }}
			width="100%"
			direction="column"
		>
			{conversationId ? (
				<>
					<Flex
						direction="column"
						justify="space-between"
						overflow="hidden"
						flexGrow={1}
					>
						<MessagesHeader userId={userId} conversationId={conversationId} />
						<MessageInput session={session} conversationId={conversationId} />
					</Flex>
				</>
			) : (
				<NoConversation />
			)}
		</Flex>
	);
};

export default FeedWrapper;
