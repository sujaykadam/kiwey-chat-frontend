import { Session } from "next-auth";

interface ConversationsWrapperProps {
	session: Session;
}

const ConversationsWrapper:React.FC<ConversationsWrapperProps> = () => {
  return (
	<div>
		Conversations Wrapper
	</div>
  );
}

export default ConversationsWrapper;