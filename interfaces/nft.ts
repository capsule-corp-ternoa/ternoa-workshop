export interface INFTData {
  description: string
  file: File | null
  title: string
}

export interface INFTMetadata {
  description: string
  image: string
  properties: {
    media: {
      hash: string
      name: string
      size: string
      type: string
    }
  }

  title: string
}
