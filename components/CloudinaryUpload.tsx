'use client'

import { useRef, useState } from 'react'

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

export default function CloudinaryUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !CLOUD_NAME || !UPLOAD_PRESET) {
      alert(!CLOUD_NAME ? 'Cloudinary not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.' : '')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.secure_url) {
        onUpload(data.secure_url)
      } else {
        alert('Upload failed: ' + (data.error?.message || 'Unknown error'))
      }
    } catch {
      alert('Upload failed. Check your Cloudinary configuration.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        style={{ display: 'none' }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        style={{
          background: uploading ? '#ccc' : '#28a745',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '0.85rem',
        }}
      >
        {uploading ? 'Uploading...' : '📷 Upload Image'}
      </button>
    </div>
  )
}
