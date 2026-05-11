'use client'

import { useRouter } from 'next/navigation'

export default function AdminLogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <button
      onClick={handleLogout}
      style={{ color: '#ff6b6b', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
    >
      Logout
    </button>
  )
}
