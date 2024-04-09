import './App.css'
import { generateClient } from 'aws-amplify/api'
import type { Schema } from '../amplify/data/resource'
import { getUrl } from 'aws-amplify/storage'
import { useState } from 'react'
import { Predictions } from '@aws-amplify/predictions'

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
      <hr />
      {/* For Mo: Ignore above. Below is the using the Predictions category directly via the browser APIs. */}
      <button onClick={async () => {
        const result = await Predictions.convert({
          translateText: {
            source: {
              text: window.prompt('Text to translate', 'Hello world!') ?? 'Hello world!',
              language: 'en'
            },
            targetLanguage: 'es'
          }
        })

        console.log(result.text)
      }}>Text-to-Speech</button>
    </>
  )
}

export default App
