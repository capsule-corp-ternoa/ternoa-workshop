import axios from 'axios'
import mime from 'mime-types'

import { INFTData } from 'interfaces/nft'

export const removeURLSlash = (url: string) => {
  if (url.length === 0) return url
  const lastChar = url.charAt(url.length - 1)
  if (lastChar === '/') {
    return url.slice(0, -1)
  } else {
    return url
  }
}

export const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_BASEURL_ALPHANET ? removeURLSlash(process.env.NEXT_PUBLIC_IPFS_BASEURL_ALPHANET) : ''
export const IPFS_UPLOAD_URL = IPFS_GATEWAY + '/api/v0'

export const uploadFiles = async (file: File) => {
  try {
    const formData = new FormData()
    formData.append(`file`, file)
    const response = await axios
      .request({
        method: 'post',
        url: `${IPFS_UPLOAD_URL}/add`,
        data: formData,
      })
      .catch((err) => {
        throw new Error(err)
      })
    return formatIpfsResponse(response.data)
  } catch (err) {
    throw err
  }
}
export const formatIpfsResponse = (res: any) => {
  const type = mime.lookup(res.Name)
  return {
    name: res.Name,
    hash: res.Hash,
    size: res.Size,
    type: type || '',
  }
}

export const nftIpfsUpload = async (data: INFTData) => {
  const { description, file, title } = data
  if (file === null) throw new Error('File cannot be null on ipfs upload')
  const { hash: fileHash } = await uploadFiles(file)
  const nftMetadata = {
    description,
    image: fileHash,
    media: {
      hash: fileHash,
      name: file?.name,
      size: file?.size,
      type: file?.type,
    },
    title,
  }
  const finalBlob = new Blob([JSON.stringify(nftMetadata)], { type: 'application/json' })
  const finalFile = new File([finalBlob], 'nft metadata')
  return await uploadFiles(finalFile)
}
