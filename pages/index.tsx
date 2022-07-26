import { useState } from 'react'
import type { NextPage } from 'next'
import type { ISubmittableResult } from '@polkadot/types/types'
import Button from '@mui/material/Button'

import ProgressModal from 'components/base/Modals/ProgressModal'
import ProgressModalNftMinting from 'components/base/Modals/ProgressModalNftMinting'
import SigningModal from 'components/base/Modals/SigningModal'
import { getRawApi, isTransactionSuccess } from 'ternoa-js'
import { IExtrinsic, IResponse, RESPONSE_DEFAULT_STATE, TransactionLifeCycleStatus } from 'interfaces'
import NFTFormMinting from 'components/block/NFTFormMinting'
import { nftsBatchTransferHex } from 'helpers/ternoa'
import { INFTData, INFTMetadata } from 'interfaces/nft'
import { IPFS_GATEWAY } from 'helpers/ipfs'

const ADDRESSES: string[] = ['5Gsj8X3dGSeCNythZ7yGGYcz2QDCtAVF7x6zDf8pj2mTeakH']
const defaultNFTData = {
  description: '',
  file: null,
  quantity: '1',
  title: '',
}

const Home: NextPage = () => {
  const [isNftMintingProgressModalOpen, setIsNftMintingProgressModalOpen] = useState(false)
  const [isNftTransferProgressModalOpen, setIsNftTransferProgressModalOpen] = useState(false)
  const [isNftMintingSigningModalOpen, setIsNftMintingSigningModalOpen] = useState(false)
  const [isNftTransferSigningModalOpen, setIsNftTransferSigningModalOpen] = useState(false)
  const [unsignedNftMintingTx, setUnsignedNftMintingTx] = useState<`0x${string}` | undefined>(undefined)
  const [unsignedNftTransferTx, setUnsignedNftTransferTx] = useState<`0x${string}` | undefined>(undefined)
  const [nftIds, setNftIds] = useState<number[]>([])
  const [nftData, setNftData] = useState<INFTData>(defaultNFTData)
  const [nftMintingResponse, setNftMintingResponse] = useState<IResponse>(RESPONSE_DEFAULT_STATE)
  const [nftTransferResponse, setNftTransferResponse] = useState<IResponse>(RESPONSE_DEFAULT_STATE)

  const handleProgressModalClose = () => {
    setIsNftMintingProgressModalOpen(false)
    setIsNftTransferProgressModalOpen(false)
  }
  const handleSigningModalClose = () => {
    setIsNftMintingSigningModalOpen(false)
    setIsNftTransferSigningModalOpen(false)
    setUnsignedNftMintingTx(undefined)
    setUnsignedNftTransferTx(undefined)
  }
  const handleNftTransfer = async () => {
    const batchNftTransferTxHex = await nftsBatchTransferHex(nftIds, ADDRESSES)
    setUnsignedNftTransferTx(batchNftTransferTxHex)
    setIsNftTransferSigningModalOpen(true)
  }

  const signableNftMintingCallback = (txHashHex: `0x${string}`) => {
    setUnsignedNftMintingTx(txHashHex)
    setIsNftMintingSigningModalOpen(true)
  }

  const nftMintingSubmittableCallback = async (res: ISubmittableResult) => {
    handleSigningModalClose()
    if (!res.isInBlock && !res.isFinalized) setIsNftMintingProgressModalOpen(true)
    try {
      const api = getRawApi()
      try {
        if (res.isInBlock && !res.isFinalized) {
          const txHash = res.txHash
          const { block } = await api.rpc.chain.getBlock(res.status.asInBlock)
          const blockNumber = block.header.number.toNumber()
          const extrinsic = block.extrinsics.filter((x) => x.hash.toHex() === txHash.toHex())[0]
          const createNftEvents = res.events.filter((x) => x.event.method === 'NFTCreated')
          const nftIds = createNftEvents.map((x) => Number.parseInt(x.event.data[0].toString()))
          const offchainData = String(createNftEvents[0].event.data[2].toHuman()) ?? ''
          const resNftMetadata = await fetch(`${IPFS_GATEWAY}/ipfs/${offchainData}`)
          if (!resNftMetadata) throw new Error('Unable to fetch nft metadata ipfs file')
          const nftMetadata = (await resNftMetadata.json()) as INFTMetadata
          const { description, image, properties, title } = nftMetadata
          const resNftImageFile = await fetch(`${IPFS_GATEWAY}/ipfs/${image ?? properties.media.hash}`)
          if (!resNftImageFile) throw new Error('Unable to fetch nft metadata ipfs file')
          const blob = await resNftImageFile.blob()
          const file = new File([blob], properties.media.name)
          const nftData = new FormData()
          nftData.append('description', description)
          nftData.append('file', file)
          nftData.append('title', title)
          setNftIds(nftIds)
          setNftData({ description, file, title })
          const isSuccess = isTransactionSuccess(res).success
          setNftMintingResponse({
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
        setNftMintingResponse({
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
    if (!res.isInBlock && !res.isFinalized) setIsNftTransferProgressModalOpen(true)
    try {
      const api = getRawApi()
      try {
        if (res.isInBlock && !res.isFinalized) {
          const txHash = res.txHash
          const { block } = await api.rpc.chain.getBlock(res.status.asInBlock)
          const blockNumber = block.header.number.toNumber()
          const extrinsic = block.extrinsics.filter((x) => x.hash.toHex() === txHash.toHex())[0]
          const isSuccess = isTransactionSuccess(res).success
          setNftTransferResponse({
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
        setNftTransferResponse({
          body: errorMessage,
          status: TransactionLifeCycleStatus.TX_FAILED,
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

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
      <ProgressModal handleClose={handleProgressModalClose} isOpen={isNftTransferProgressModalOpen} response={nftTransferResponse} />
      <ProgressModalNftMinting
        handleClose={handleProgressModalClose}
        isOpen={isNftMintingProgressModalOpen}
        response={nftMintingResponse}
        nftData={nftData}
        quantity={nftIds.length}
      />
    </>
  )
}

export default Home
