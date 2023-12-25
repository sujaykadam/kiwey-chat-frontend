import { Button, Center, Image, Input, Stack, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useState } from "react";

interface IAuthProps {
	session: Session | null;
	reloadSession: () => void;
}

const Auth: React.FC<IAuthProps> = ({
	session,
	reloadSession,
}) => {
	const [username, setUsername] = useState("");

	const onsubmit = async () => {
		try {
			//grapql mutation for username
		} catch (error) {
			console.log('onSubmit error:', error);
		}
	};

	return (
		<Center height="100vh" >
			<Stack align="center" spacing="8">
				{session ? (
					<>
						<Text fontSize="3xl">
							Create Username
						</Text>
						<Input placeholder="Username" value={username} onChange={(event) => setUsername(event.target.value)}/>
						<Button width='100%' onClick={onsubmit}>
							Save
						</Button>
					</>
				): (
					<>
						<Text fontSize="3xl">
							Kiwey Chat
						</Text>
						<Button onClick={() => signIn("google")} leftIcon={<Image height="20px" src="/images/googlelogo.png" alt="Google"/> }>
							Continue with Google
						</Button>
					</>	
				)}
			</Stack>
		</Center>
	);
};

export default Auth;
