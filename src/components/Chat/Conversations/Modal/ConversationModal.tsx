import { useLazyQuery, useMutation } from "@apollo/client";
import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import conversationOperations from "../../../../graphql/operations/conversation";
import userOperations from "../../../../graphql/operations/user";
import { SearchUsersData, SearchUsersInput, SearchedUser, createConversationData, createConversationInputs } from "../../../../util/types";
import Participants from "./Participants";
import UserSearchList from "./UserSearchList";
interface ConversationModalProps {
	isOpen: boolean;
	onClose: () => void;
	session: Session;
}

const ConversationModal: React.FC<ConversationModalProps> = ({isOpen, onClose, session}) => {
	const [username, setUsername] = useState('');
	const [participants, setParticipants] = useState<Array<SearchedUser>>([]);
	const [searchUsers, {data: searchUsersData, loading: searchUsersLoading }] = useLazyQuery<SearchUsersData, SearchUsersInput>(userOperations.Queries.searchUsers);
	const [createConversation, { loading: createConversationLoading }] = useMutation<createConversationData, createConversationInputs>(conversationOperations.Mutations.createConversation);

	const router = useRouter();

	const onSearch = async (event: React.FormEvent) => { 
		event.preventDefault();
		searchUsers({variables: {username}});
	}
	const addParticipant = (user: SearchedUser) => {
		setParticipants(prev => Array.from(new Set([...prev, user])));
	}
	const removeParticipant = (userId: String) => {
		setParticipants(prev => prev.filter(user => user.id !== userId));
	}
	const oncreateConversation = async() => {
		try {
			const {data: conversation} = await createConversation({variables: {
				participantIds: [...participants.map(user => user.id), session?.user?.id]
			}})
			if (!conversation?.createConversation){
				throw new Error("Conversation not created");
			}	
			toast.success("Conversation created");
			const {conversationId} = conversation.createConversation;
			router.push({ query: { conversationId } })
			// Reset state
			setParticipants([]);
			setUsername('');
			onClose();
		} catch (error:any) {
			console.log("oncreateConversation Error", error);
			toast.error(error?.message);
		}
	}

	return (
		<>	
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent bg='#2d2d2d' pb={4}>
					<ModalHeader>Create a conversation</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<form onSubmit={onSearch}>
							<Stack spacing={4}>
								<Input placeholder="Enter Username" value={username} onChange={(event) => setUsername(event.target.value)}/>
								<Button type="submit" isDisabled={!username} isLoading={searchUsersLoading}>
									Submit
								</Button>
							</Stack>
						</form>
						{searchUsersData?.searchUsers && <UserSearchList users={searchUsersData?.searchUsers} addParticipant={addParticipant}/>}
						{participants.length !== 0 && (
							<>
								<Participants participants={participants} removeParticipant={removeParticipant} />
								<Button bg="brand.100" width="100%" isLoading={createConversationLoading} mt={6} _hover={{bg: "#F124CA"}} onClick={oncreateConversation}>
									Create Conversation
								</Button>
							</>
						)}
					</ModalBody>
				</ModalContent>
		  	</Modal>
		</>
	)
}

export default ConversationModal;