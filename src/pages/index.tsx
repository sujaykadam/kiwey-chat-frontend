import type { NextPage, NextPageContext } from 'next'
import {getSession, signIn, signOut, useSession} from 'next-auth/react'

const Home: NextPage = () => {
	const {data: data, } = useSession()
	console.log(data)
	return (
		<div>
			{!Boolean(data?.user) ? 
				<button onClick={() => signIn('google')}>Sign In</button> :
				<button onClick={() => signOut()}>Sign Out</button>
			}
			{data?.user?.name}
		</div>
	)
}

export async function getServerSideProps(context: NextPageContext){
	const session = await getSession(context);
	return {
		props: {
			session: session
		}
	}
}

export default Home
