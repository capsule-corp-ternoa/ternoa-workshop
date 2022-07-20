import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FileUploader } from 'react-drag-drop-files'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { nftsBatchMintingHex } from 'helpers/ternoa'
import { INFTData } from 'interfaces/nft'

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
    <form onSubmit={formik.handleSubmit}>
      <FileUploader handleChange={handleFileChange} name="file" />
      <TextField
        id="title"
        name="title"
        label="Title"
        variant="outlined"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.title}
        error={formik.touched.title && Boolean(formik.errors.title)}
        helperText={formik.touched.title && formik.errors.title}
      />
      <TextField
        id="description"
        name="description"
        label="Description"
        variant="outlined"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.description}
        error={formik.touched.description && Boolean(formik.errors.description)}
        helperText={formik.touched.description && formik.errors.description}
      />
      <TextField
        id="quantity"
        name="quantity"
        label="Quantity"
        variant="outlined"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.quantity}
        error={formik.touched.quantity && Boolean(formik.errors.quantity)}
        helperText={formik.touched.quantity && formik.errors.quantity}
      />
      <Button disabled={formik.isSubmitting || !formik.isValid} type="submit" variant="contained">
        Submit
      </Button>
    </form>
  )
}

export default NFTFormMinting

const NFTFormMintingSchema = Yup.object().shape({
  file: Yup.mixed().required('Required'),
  title: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  quantity: Yup.number().min(1).max(1000).required('Required'),
})
