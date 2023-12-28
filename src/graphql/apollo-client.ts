import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

if (!process.env.NEXT_PUBLIC_GRAPHQL_URL) {
	throw new Error("Missing env variable NEXT_PUBLIC_GRAPHQL_URL");
}
const httpLink = new HttpLink({
	uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
	credentials: "include",
});

if (!process.env.NEXT_PUBLIC_GRAPHQL_WS_URL) {
	throw new Error("Missing env variable NEXT_PUBLIC_GRAPHQL_WS_URL");
}
const wsLink =
	typeof window !== "undefined"
		? new WebSocketLink(
				createClient({
					url: process.env.NEXT_PUBLIC_GRAPHQL_WS_URL,
				})
		  )
		: null;

const link =
	typeof window !== undefined && wsLink !== null
		? split(
				({ query }) => {
					const definition = getMainDefinition(query);
					return (
						definition.kind === "OperationDefinition" &&
						definition.operation === "subscription"
					);
				},
				wsLink,
				httpLink
		  )
		: httpLink;

export const client = new ApolloClient({
	link,
	cache: new InMemoryCache(),
});
