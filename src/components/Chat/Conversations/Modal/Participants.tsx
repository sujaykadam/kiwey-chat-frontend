import { Flex, Stack, Text } from "@chakra-ui/react";
import { IoIosClose } from "react-icons/io";
import { SearchedUser } from "../../../../util/types";

interface ParticipantsProps {
	  participants: Array<SearchedUser>,
	  removeParticipant: (userId: String) => void;
}

const Participants: React.FunctionComponent<ParticipantsProps> = ({participants, removeParticipant}) => {
  return (
		<Flex mt={8} gap="10px" flexWrap="wrap">
			{participants.map((participant) => (
				<Stack flexDirection="row" align="center" bg="whiteAlpha.200" borderRadius={4} p={2} key={participant.id}>
					<Text color="whiteAlpha.700">
						{participant.username}
					</Text>
					<IoIosClose size={20} cursor="pointer" onClick={() => removeParticipant(participant.id)}/>
				</Stack>
			))}
		</Flex>
    );
};

export default Participants;
