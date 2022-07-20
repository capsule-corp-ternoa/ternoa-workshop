import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FileUploader } from 'react-drag-drop-files'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { nftsBatchMintingHex } from 'helpers/ternoa'
import { INFTData } from 'interfaces/nft'

import styles from './NFTFormMinting.module.scss'

interface Props {
  signableCallback: (txHashHex: `0x${string}`) => void
}

const NFTFormMinting = ({ signableCallback }: Props) => {
  const formik = useFormik({
    initialValues: {
      description: '',
      file: null,
      quantity: 1,
      title: '',
    },
    validateOnMount: true,
    onSubmit: async (values) => {
      const createNftTxHex = await nftsBatchMintingHex(values as unknown as INFTData) //TODO: improve typing
      signableCallback(createNftTxHex)
    },
    validationSchema: NFTFormMintingSchema,
  })

  const handleFileChange = (file: any) => {
    formik.setFieldValue('file', file)
  }

  return (
    <>
      <h1 className={styles.header}>Start to create your NFT</h1>
      <form onSubmit={formik.handleSubmit} className={styles.formWrapper}>
        <h2 className={styles.title}>Upload your image here:</h2>
        <div className={styles.uploader}>
          <FileUploader handleChange={handleFileChange} name="file" onTypeError={(err: any) => console.log(err)} onSizeError={(err: any) => console.log(err)} />
        </div>
        <h2 className={styles.title}>Add your metadatas:</h2>
        <div className={styles.inputWrapper}>
          <h2>NFT name:</h2>
          <div className={styles.description}>Add the name of your NFT.</div>
          <TextField
            id="title"
            name="title"
            label="Title"
            variant="outlined"
            fullWidth
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />
        </div>
        <div className={styles.inputWrapper}>
          <h2>NFT Description:</h2>
          <div className={styles.description}>Describe how unique your NFT is.</div>
          <TextField
            id="description"
            name="description"
            label="Description"
            variant="outlined"
            fullWidth
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
          />
        </div>
        <div className={styles.inputWrapper}>
          <h2>Quantity:</h2>
          <div className={styles.description}>How many NFT do you want to mint?</div>
          <TextField
            id="quantity"
            name="quantity"
            label="Quantity"
            variant="outlined"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.quantity}
            fullWidth
            error={formik.touched.quantity && Boolean(formik.errors.quantity)}
            helperText={formik.touched.quantity && formik.errors.quantity}
          />
        </div>
        <div className={styles.submitBtn}>
          <Button disabled={formik.isSubmitting || !formik.isValid} type="submit" variant="contained" size="large">
            Submit
          </Button>
        </div>
      </form>
    </>
  )
}

export default NFTFormMinting

const NFTFormMintingSchema = Yup.object().shape({
  file: Yup.mixed().required('Required'),
  title: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  quantity: Yup.number().min(1).max(1000).required('Required'),
})
