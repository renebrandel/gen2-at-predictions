import './App.css'
import { generateClient } from 'aws-amplify/api'
import type { Schema } from '../amplify/data/resource'
import { getUrl } from 'aws-amplify/storage'
import { useState } from 'react'

const client = generateClient<Schema>()

function App() {
  const [src, setSrc] = useState("")
  const [file, setFile] = useState("")
  return (
    <>
      <button onClick={async () => {
        const { data } = await client.mutations.convertTextToSpeech({
          text: "Hello"
        })

        setFile(data)
      }}>Synth</button>
      <button onClick={async () => {

        const res = await getUrl({
          key: file,
          options: {
            accessLevel: 'guest',
            expiresIn: 60 * 60 * 24
          }
        })

        setSrc(res.url.toString())
      }}>Fetch audio</button>
      <a href={src}>Get audio file</a>
    </>
  )
}

export default App
