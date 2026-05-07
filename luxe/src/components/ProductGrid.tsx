import React from 'react';
import ProductCard from './ProductCard';
import styles from './ProductGrid.module.css';

interface Product {
    id: string;
    slug: string;
    name: string;
    category: string;
    price: number;
    images: string;
}

interface ProductGridProps {
    products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
    return (
        <div className={styles.grid}>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductGrid;
