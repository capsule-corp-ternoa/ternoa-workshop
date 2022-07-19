import { useEffect, useState } from 'react'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { store } from 'redux/store'
import { initializeApi } from 'ternoa-js'

import Layout from 'components/base/Layout'
import 'styles/main.scss'

function MyApp({ Component, pageProps }: AppProps) {
  const [isSDKInitialized, setIsSDKInitialized] = useState(false)
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
    return null
  }

  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  )
}

export default MyApp