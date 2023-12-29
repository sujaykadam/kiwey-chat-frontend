import { Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import MessagesHeader from "./Messages/Header";
import MessageInput from "./Messages/Input";

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
						{/* {conversationId} */}
						<MessagesHeader userId={userId} conversationId={conversationId} />
						{/* <Messages /> */}
					</Flex>
					<MessageInput session={session} conversationId={conversationId} />
				</>
			) : (
				<div>No Conversation</div>
			)}
		</Flex>
	);
};

export default FeedWrapper;
