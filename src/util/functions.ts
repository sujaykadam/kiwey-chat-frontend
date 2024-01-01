import { participantPopulated } from "../../kiwey-chat-backend/src/util/types";

export const formatUsernames = (
	participants: Array<participantPopulated>,
	myUserId: string
): string => {
	const usernames = participants
		.filter((participant) => participant.user.id != myUserId)
		.map((participant) => participant.user.username);

	return usernames.join(", ");
};
