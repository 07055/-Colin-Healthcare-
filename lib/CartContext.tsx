'use client'

import React, { createContext, useContext, useState, useEffect, useRef } from 'react'

export interface CartItem {
    id: string
    name: string
    price: number
    images: string | string[]
    quantity: number
}

interface CartContextType {
    cart: CartItem[]
    addToCart: (product: any) => void
    removeFromCart: (productId: string) => void
    updateQuantity: (productId: string, quantity: number) => void
    clearCart: () => void
    cartCount: number
    cartTotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function getCartKey(userId?: string): string {
    return userId ? `samsuma-cart-${userId}` : 'samsuma-cart-anon'
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([])
    const [userId, setUserId] = useState<string | null>(null)
    const [ready, setReady] = useState(false)
    const prevUserId = useRef<string | null>(null)

    useEffect(() => {
        fetch('/api/auth/me')
            .then(r => r.json())
            .then(data => {
                const uid = data.user?.id || null
                setUserId(uid)
                prevUserId.current = uid
                const key = getCartKey(uid)
                const saved = localStorage.getItem(key)
                if (saved) {
                    try { setCart(JSON.parse(saved)) } catch {}
                }
                setReady(true)
            })
            .catch(() => {
                setReady(true)
            })
    }, [])

    useEffect(() => {
        if (!ready) return
        const currentUid = userId
        const prevUid = prevUserId.current

        if (prevUid !== currentUid) {
            const oldKey = getCartKey(prevUid || undefined)
            const newKey = getCartKey(currentUid || undefined)

            const newCartData = localStorage.getItem(newKey)

            if (newCartData) {
                try { setCart(JSON.parse(newCartData)) } catch {}
            } else if (prevUid === null) {
                const oldCartData = localStorage.getItem(oldKey)
                if (oldCartData) {
                    localStorage.setItem(newKey, oldCartData)
                    localStorage.removeItem(oldKey)
                    try { setCart(JSON.parse(oldCartData)) } catch {}
                } else {
                    setCart([])
                }
            } else {
                setCart([])
            }

            prevUserId.current = currentUid
        }
    }, [userId, ready])

    useEffect(() => {
        if (!ready) return
        const key = getCartKey(userId || undefined)
        localStorage.setItem(key, JSON.stringify(cart))
    }, [cart, userId, ready])

    const addToCart = (product: any) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id)
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                )
            }
            return [...prev, { id: product.id, name: product.name, price: product.price, images: product.images || '', quantity: 1 }]
        })
    }

    const removeFromCart = (productId: string) => {
        setCart((prev) => prev.filter((item) => item.id !== productId))
    }

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) return
        setCart((prev) =>
            prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
        )
    }

    const clearCart = () => setCart([])

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (undefined === context) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
