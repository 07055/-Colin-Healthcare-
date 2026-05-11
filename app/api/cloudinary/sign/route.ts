import { NextResponse } from 'next/server'
import crypto from 'crypto'

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const API_KEY = process.env.CLOUDINARY_API_KEY
const API_SECRET = process.env.CLOUDINARY_API_SECRET

export async function POST() {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 })
  }

  const timestamp = Math.round(Date.now() / 1000)
  const params = { timestamp, upload_preset: 'ml_default' }
  const sorted = Object.keys(params).sort().map(k => `${k}=${params[k as keyof typeof params]}`).join('&')
  const signature = crypto.createHash('sha1').update(`${sorted}${API_SECRET}`).digest('hex')

  return NextResponse.json({ signature, timestamp, api_key: API_KEY, cloud_name: CLOUD_NAME, upload_preset: 'ml_default' })
}
