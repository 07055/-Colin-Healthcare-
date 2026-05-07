'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ProductChart({ products }: { products: any[] }) {
    const data = products
        .slice(0, 10)
        .map(p => ({
            name: p.name.length > 15 ? p.name.slice(0, 15) + '...' : p.name,
            price: p.price,
            stock: p.stock,
        }))
        .reverse();

    if (data.length === 0) {
        return <p style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>No data to display</p>;
    }

    return (
        <div style={{ width: '100%', height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="price" fill="#f68b1e">
                        {data.map((_, i) => (
                            <Cell key={`cell-${i}`} fill={i % 2 === 0 ? '#f68b1e' : '#f9a84d'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
