import React from 'react'

import Warning from 'assets/svg/Components/Warning'
import ClipboardCopy from 'components/ui/ClipboardCopy'
import Loader from 'components/ui/Loader'
import Modal from 'components/ui/Modal'
import { IResponse, TransactionLifeCycleStatus } from 'interfaces'
import { useAppSelector } from 'redux/hooks'
import { middleEllipsis } from 'utils/strings'

import styles from './ProgressModalNftMinting.module.scss'
import { INFTData } from 'interfaces/nft'

export interface ProgressModalNftMintingProps {
  handleClose: () => void
  isOpen: boolean
  nftData: INFTData
  quantity: number
  response: IResponse
}

const getTxExplorerLink = (wssEndpoint: string, suffix: string) => {
  const subdomain = wssEndpoint.includes('alphanet') ? 'explorer-alphanet.' : 'explorer.'
  const extension = wssEndpoint.includes('alphanet') ? '.dev' : '.com'
  return `https://${subdomain}ternoa${extension}${suffix}`
}

const ProgressModalNftMinting = ({ handleClose, isOpen, nftData, response, quantity }: ProgressModalNftMintingProps) => {
  const { app } = useAppSelector((state) => state.app)
  const { wssEndpoint } = app
  const { body, status, txHash, txLinkSuffix } = response
  const { description: nftDescription, file: nftFile, title: nftTitle } = nftData
  const txLink = txLinkSuffix && getTxExplorerLink(wssEndpoint, txLinkSuffix)

  return (
    <Modal handleClose={handleClose} isClosable isOpen={isOpen}>
      <div className={styles.root}>
        {status === TransactionLifeCycleStatus.TX_PENDING && (
          <>
            <Loader useLottie />
            <div className={styles.status}>Pending...</div>
          </>
        )}
        {status === TransactionLifeCycleStatus.TX_FAILED && (
          <>
            <Warning className={styles.warning} />
            <div className={styles.status}>Transaction failed</div>
          </>
        )}
        {status === TransactionLifeCycleStatus.TX_SUCCESS && (
          <>
            <div className={styles.status}>{`${quantity} NFT successfully minted`}</div>
            {nftFile && (
              <div className={styles.nftFileContainer}>
                <img alt="nft" className={styles.nftFile} src={URL.createObjectURL(nftFile)} />
              </div>
            )}
            {nftTitle && <div className={styles.nftTitle}>{nftTitle}</div>}
            {nftDescription && <div className={styles.nftDescription}>{nftDescription}</div>}
          </>
        )}
        {txHash && (
          <div className={styles.hash}>
            Tx hash:
            <ClipboardCopy className={styles.txHash} content={txHash.toString()} placeholder={middleEllipsis(txHash.toString())} />
          </div>
        )}
        {txLinkSuffix && (
          <a className={styles.link} href={txLink} target="_blank" rel="noopener noreferrer" title="Ternoa explorer">
            View on explorer
          </a>
        )}
        {body && <div className={styles.body}>{body}</div>}
      </div>
    </Modal>
  )
}

export default ProgressModalNftMinting
