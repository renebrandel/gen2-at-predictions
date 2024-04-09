import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Amplify } from 'aws-amplify'
import amplifyconfig from '../amplifyconfiguration.json'

Amplify.configure(amplifyconfig)
// For Mo: this is the manual step required because `backend.addOutput` doesn't fully support the 
// types for predictions yet
Amplify.configure({...Amplify.getConfig(), Predictions: amplifyconfig.custom.Predictions})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
