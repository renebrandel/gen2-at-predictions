import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // For Mo: Looks like there's this error with Vite config. Found the solution here
  // https://github.com/aws-amplify/amplify-js/issues/11175#issuecomment-1659764326
  define: {
    global: {}
  }
})
