import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { getSession } from "next-auth/react";

try {
	if (!process.env.NEXT_PUBLIC_GRAPHQL_URL) {
		throw new Error("Missing env variable NEXT_PUBLIC_GRAPHQL_URL");
	}
	if (!process.env.NEXT_PUBLIC_GRAPHQL_WS_URL) {
		throw new Error("Missing env variable NEXT_PUBLIC_GRAPHQL_WS_URL");
	}
} catch (error: any) {
	console.log("error", error);
}

const httpLink = new HttpLink({
	uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
	credentials: "include",
});

const wsLink =
	typeof window !== "undefined"
		? new GraphQLWsLink(
				createClient({
					url: process.env.NEXT_PUBLIC_GRAPHQL_WS_URL || "",
					connectionParams: async () => ({
						session: await getSession(),
					}),
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
