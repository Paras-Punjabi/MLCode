"use client"

import { useAuth } from "@clerk/nextjs";
import { useState } from "react";

const Home = () => {
  const { getToken } = useAuth()
  const [token, setToken] = useState('')

  return (<>Welcome to MLCode
    <button onClick={async () => {
      const res = await getToken({ skipCache: true })
      console.log(res)
      setToken(res || '')
    }}>click here</button>
    <pre>
      {token}
    </pre>
  </>);
};

export default Home;
