import { useLazyQuery } from "@apollo/client";
import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack } from "@chakra-ui/react";
import { useState } from "react";
import userOperations from "../../../../graphql/operations/user";
import { SearchUsersData, SearchUsersInput, SearchedUser } from "../../../../util/types";
import UserSearchList from "./UserSearchList";
import Participants from "./Participants";

interface ConversationModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const ConversationModal: React.FC<ConversationModalProps> = ({isOpen, onClose}) => {
	const [username, setUsername] = useState('');
	const [participants, setParticipants] = useState<Array<SearchedUser>>([]);
	const [searchUsers, {data, error, loading}] = useLazyQuery<SearchUsersData, SearchUsersInput>(userOperations.Queries.searchUsers);

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
								<Button type="submit" isDisabled={!username}>
									Submit
								</Button>
							</Stack>
						</form>
						{data?.searchUsers && <UserSearchList users={data?.searchUsers} addParticipant={addParticipant}/>}
						{participants.length !== 0 && <Participants participants={participants} removeParticipant={removeParticipant} />}
					</ModalBody>
				</ModalContent>
		  	</Modal>
		</>
	)
}

export default ConversationModal;