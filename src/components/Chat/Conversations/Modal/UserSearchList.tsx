import { Avatar, Button, Flex, Stack, Text } from "@chakra-ui/react";
import { SearchedUser } from "../../../../util/types";

interface UserSearchListProps {
	users: Array<SearchedUser>
}

const UserSearchList: React.FunctionComponent<UserSearchListProps> = ({users}) => {
	return (
		<>
			{users.length === 0 ? (
				<Flex mt={6} justifyContent='center'>
					<Text>No users found</Text>
				</Flex>
			) : (
				<Stack mt={6}>
					{users.map((user) => (
						<Stack direction="row" align="center" _hover={{bg: "whiteAlpha.200"}} spacing={4} py={2} px={4} borderRadius={4} key={user.username}>
							<Avatar />
							<Flex justify="space-between" align="center" width="100%">
								<Text color="whiteAlpha.700">
									{user.username}
								</Text>
								<Button bg="brand.100" _hover={{bg: "#F124CA"}} onClick={() => {}}>
									Select
								</Button>
							</Flex>
						</Stack>
					))}
				</Stack>
			)}
		</>
	);
};

export default UserSearchList;
