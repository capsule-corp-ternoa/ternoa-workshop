import type { ISubmittableResult, Signer } from '@polkadot/types/types'
import { batchAllTxHex, createNftTx, getRawApi, query, submitTxHex, transferNftTx } from 'ternoa-js'

import { INFTData } from 'interfaces/nft'

import { nftIpfsUpload } from './ipfs'

export const nftsBatchMintingHex = async (nftMetadata: INFTData, quantity: string) => {
  const { hash: offchainData } = await nftIpfsUpload(nftMetadata)
  const nftTx = await createNftTx(offchainData, 0, undefined, false)
  const nftsTxs = new Array(Number(quantity)).fill(nftTx)
  return await batchAllTxHex(nftsTxs)
}

export const nftsBatchTransferHex = async (nftIds: number[], addresses: string[]) => {
  if (nftIds.length < addresses.length) throw new Error('Not enough NFTs for all participants')
  const nftTransferTxs = await Promise.all(nftIds.map(async (nftId, idx) => await transferNftTx(nftId, addresses[idx])))
  return await batchAllTxHex(nftTransferTxs)
}

export const signTx = async (tx: `0x${string}`, address: string, signer: Signer): Promise<`0x${string}`> => {
  const api = getRawApi()
  const nonce = ((await query('system', 'account', [address])) as any).nonce.toNumber()
  return (await api.tx(tx).signAsync(address, { nonce, signer })).toHex()
}

export const runTx = async (signedTx: `0x${string}`, callback?: (res: ISubmittableResult) => void): Promise<`0x${string}`> => {
  return await submitTxHex(signedTx, callback)
}
