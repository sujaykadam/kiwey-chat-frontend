import { Session } from "next-auth";

interface FeedWrapperProps {
	session: Session;
}

const FeedWrapper:React.FC<FeedWrapperProps> = () => {
  return (
	<div>
		Feed Wrapper
	</div>
  );
}

export default FeedWrapper;