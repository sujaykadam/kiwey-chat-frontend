import type { NextPage } from 'next'
import {signIn, signOut, useSession} from 'next-auth/react'

const Home: NextPage = () => {
  const {data: data, } = useSession()
  console.log(data)
  return (
    <div>
      { 
        !Boolean(data?.user) ? 
          <button onClick={() => signIn('google')}>Sign In</button> :
          <button onClick={() => signOut()}>Sign Out</button>
      }
    </div>
  )
}

export default Home
