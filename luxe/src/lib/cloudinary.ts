import crypto from 'crypto'

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const API_KEY = process.env.CLOUDINARY_API_KEY
const API_SECRET = process.env.CLOUDINARY_API_SECRET
const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || 'ssm-products'

export async function uploadToCloudinary(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)
    formData.append('api_key', API_KEY!)

    const timestamp = Math.round(new Date().getTime() / 1000)
    const stringToSign = `timestamp=${timestamp}&upload_preset=${UPLOAD_PRESET}${API_SECRET}`
    const signature = crypto.createHash('sha1').update(stringToSign).digest('hex')

    formData.append('timestamp', timestamp.toString())
    formData.append('signature', signature)

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
    })

    const data = await response.json()

    if (data.secure_url) {
        return data.secure_url
    }

    throw new Error(data.error?.message || 'Upload failed')
}
