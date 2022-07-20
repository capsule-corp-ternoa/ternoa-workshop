import { useState } from 'react'
import type { NextPage } from 'next'
import type { ISubmittableResult } from '@polkadot/types/types'
import Button from '@mui/material/Button'

import ProgressModal from 'components/base/Modals/ProgressModal'
import SigningModal from 'components/base/Modals/SigningModal'
import { getRawApi, isTransactionSuccess } from 'ternoa-js'
import { IExtrinsic, IResponse, RESPONSE_DEFAULT_STATE, TransactionLifeCycleStatus } from 'interfaces'
import NFTFormMinting from 'components/block/NFTFormMinting'
import { nftsBatchTransferHex } from 'helpers/ternoa'

const ADDRESSES: string[] = []

const Home: NextPage = () => {
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false)
  const [isNftMintingSigningModalOpen, setIsNftMintingSigningModalOpen] = useState(false)
  const [isNftTransferSigningModalOpen, setIsNftTransferSigningModalOpen] = useState(false)
  const [unsignedNftMintingTx, setUnsignedNftMintingTx] = useState<`0x${string}` | undefined>(undefined)
  const [unsignedNftTransferTx, setUnsignedNftTransferTx] = useState<`0x${string}` | undefined>(undefined)
  const [nftIds, setNftIds] = useState<number[]>([])
  const [response, setResponse] = useState<IResponse>(RESPONSE_DEFAULT_STATE)

  const handleProgressModalClose = () => {
    setIsProgressModalOpen(false)
    setResponse(RESPONSE_DEFAULT_STATE)
  }
  const handleSigningModalClose = () => {
    setIsNftMintingSigningModalOpen(false)
    setIsNftTransferSigningModalOpen(false)
    setUnsignedNftMintingTx(undefined)
    setUnsignedNftTransferTx(undefined)
  }
  const handleNftTransfer = async () => {
    const batchNftTransferTxHex = await nftsBatchTransferHex(nftIds, ADDRESSES) //TODO: improve typing
    setUnsignedNftTransferTx(batchNftTransferTxHex)
    setIsNftTransferSigningModalOpen(true)
  }

  const signableNftMintingCallback = (txHashHex: `0x${string}`) => {
    setUnsignedNftMintingTx(txHashHex)
    setIsNftMintingSigningModalOpen(true)
  }

  const nftMintingSubmittableCallback = async (res: ISubmittableResult) => {
    handleSigningModalClose()
    setIsProgressModalOpen(true)
    try {
      const api = getRawApi()
      try {
        if (res.isInBlock) {
          const txHash = res.txHash
          const { block } = await api.rpc.chain.getBlock(res.status.asInBlock)
          const blockNumber = block.header.number.toNumber()
          const extrinsic = block.extrinsics.filter((x) => x.hash.toHex() === txHash.toHex())[0]
          const createNftEvents = res.events.filter((x) => x.event.method === 'NFTCreated')
          const nftIds = createNftEvents.map((x) => Number.parseInt(x.event.data[0].toString()))
          setNftIds(nftIds)
          const isSuccess = isTransactionSuccess(res).success
          setResponse({
            ...RESPONSE_DEFAULT_STATE,
            isTxSuccess: isSuccess,
            status: isSuccess ? TransactionLifeCycleStatus.TX_SUCCESS : TransactionLifeCycleStatus.TX_FAILED,
            txExtrinsic: extrinsic.toHuman() as IExtrinsic,
            txHash,
            txLinkSuffix: `/extrinsic/${blockNumber}-${res.txIndex}`,
          })
        }
      } catch (error: any) {
        console.log(error)
        const errorMessage =
          typeof error === 'string' ? error : typeof error !== 'object' ? 'Unknown error' : error.message ? error.message : JSON.stringify(error)
        setResponse({
          body: errorMessage,
          status: TransactionLifeCycleStatus.TX_FAILED,
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const nftTransferSubmittableCallback = async (res: ISubmittableResult) => {
    handleSigningModalClose()
    setIsProgressModalOpen(true)
    try {
      const api = getRawApi()
      try {
        if (res.isInBlock) {
          const txHash = res.txHash
          const { block } = await api.rpc.chain.getBlock(res.status.asInBlock)
          const blockNumber = block.header.number.toNumber()
          const extrinsic = block.extrinsics.filter((x) => x.hash.toHex() === txHash.toHex())[0]
          const isSuccess = isTransactionSuccess(res).success
          setResponse({
            ...RESPONSE_DEFAULT_STATE,
            isTxSuccess: isSuccess,
            status: isSuccess ? TransactionLifeCycleStatus.TX_SUCCESS : TransactionLifeCycleStatus.TX_FAILED,
            txExtrinsic: extrinsic.toHuman() as IExtrinsic,
            txHash,
            txLinkSuffix: `/extrinsic/${blockNumber}-${res.txIndex}`,
          })
        }
      } catch (error: any) {
        console.log(error)
        const errorMessage =
          typeof error === 'string' ? error : typeof error !== 'object' ? 'Unknown error' : error.message ? error.message : JSON.stringify(error)
        setResponse({
          body: errorMessage,
          status: TransactionLifeCycleStatus.TX_FAILED,
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  console.log(nftIds)

  return (
    <>
      <main className="container">
        <div className="wrapper">
          <div className="outterContainer">
            <div className="mainContainer">
              <NFTFormMinting signableCallback={signableNftMintingCallback} />
              <div className="mainContainer-transferBtn">
                <Button disabled={nftIds.length < 1} onClick={handleNftTransfer} variant="contained">
                  Transfer nfts to participants
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      {unsignedNftMintingTx && (
        <SigningModal
          handleClose={handleSigningModalClose}
          isOpen={isNftMintingSigningModalOpen}
          submittableCallback={nftMintingSubmittableCallback}
          txHashHex={unsignedNftMintingTx}
        />
      )}
      {unsignedNftTransferTx && (
        <SigningModal
          handleClose={handleSigningModalClose}
          isOpen={isNftTransferSigningModalOpen}
          submittableCallback={nftTransferSubmittableCallback}
          txHashHex={unsignedNftTransferTx}
        />
      )}
      <ProgressModal handleClose={handleProgressModalClose} isOpen={isProgressModalOpen} response={response} />
    </>
  )
}

export default Home
