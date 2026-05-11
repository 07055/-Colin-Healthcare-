'use client'

import { useRef, useState } from 'react'

export default function CloudinaryUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      const signRes = await fetch('/api/cloudinary/sign', { method: 'POST' })
      const signData = await signRes.json()
      if (!signData.cloud_name) {
        alert('Cloudinary not configured on server')
        setUploading(false)
        return
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('api_key', signData.api_key)
      formData.append('timestamp', String(signData.timestamp))
      formData.append('signature', signData.signature)
      formData.append('upload_preset', signData.upload_preset)

      const res = await fetch(`https://api.cloudinary.com/v1_1/${signData.cloud_name}/image/upload`, {
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
