import { useEffect, useState } from 'react'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { store } from 'redux/store'
import { initializeApi } from 'ternoa-js'
import { ThemeProvider } from '@mui/material/styles'
import { appTheme } from 'theme'

import Layout from 'components/base/Layout'
import 'styles/main.scss'
import Loader from 'components/ui/Loader'

function MyApp({ Component, pageProps }: AppProps) {
  const [isSDKInitialized, setIsSDKInitialized] = useState<boolean>(false)

  useEffect(() => {
    let shouldUpdate = true
    const initSDK = async () => {
      try {
        await initializeApi()
        if (shouldUpdate) setIsSDKInitialized(true)
      } catch (error) {
        console.log(error)
      }
    }

    initSDK()
    return () => {
      shouldUpdate = false
    }
  }, [])

  if (!isSDKInitialized) {
    return <Loader className="loader" size="medium" useLottie />
  }

  return (
    <Provider store={store}>
      <ThemeProvider theme={appTheme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </Provider>
  )
}

export default MyApp
