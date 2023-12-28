import { useMutation } from "@apollo/client";
import { Button, Center, Image, Input, Stack, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import userOperations from "../../graphql/operations/user";
import { CreateUsernameData, CreateUsernameVariables } from "../../util/types";

interface IAuthProps {
	session: Session | null;
	reloadSession: () => void;
}

const Auth: React.FC<IAuthProps> = ({
	session,
	reloadSession,
}) => {
	const [username, setUsername] = useState("");
	const [createUsername, {loading, error}] = useMutation<CreateUsernameData, CreateUsernameVariables>(
		userOperations.Mutations.createUsername
	);

	const onsubmit = async () => {
		try {
			const {data} = await createUsername({variables: {username}});
			if(!data?.createUsername){
				throw new Error("No data returned");
			}
			
			if(data.createUsername.error){
				throw new Error(data.createUsername.error);
			}
			toast.success("Username successfully created");
			reloadSession();
		} catch (error:any) {
			toast.error(error.message);
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
						<Button width='100%' onClick={onsubmit} isLoading={loading}>
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
