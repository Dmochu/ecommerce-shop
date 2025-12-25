'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Heart, Share2, Star } from 'lucide-react'
import ProductCard from './ProductCard'
import StockNotificationForm from './StockNotificationForm'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  stock: number
  category: {
    name: string
  }
}

interface ProductDetailsProps {
  product: Product
  relatedProducts: Product[]
}

export default function ProductDetails({ product, relatedProducts }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', product.id, 'quantity:', quantity)
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500">
        <ol className="flex space-x-2">
          <li><Link href="/" className="hover:text-tulinki-burgundy">Strona główna</Link></li>
          <li>/</li>
          <li><Link href="/products" className="hover:text-tulinki-burgundy">Produkty</Link></li>
          <li>/</li>
          <li><Link href={`/products?category=${product.category.name}`} className="hover:text-tulinki-burgundy">{product.category.name}</Link></li>
          <li>/</li>
          <li className="text-gray-900">{product.name}</li>
        </ol>
      </nav>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400">Brak zdjęcia</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <span className="text-sm text-tulinki-burgundy bg-tulinki-rose/20 px-3 py-1 rounded-full">
              {product.category.name}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">(4.5/5)</span>
          </div>

          <div className="text-3xl font-bold text-tulinki-burgundy">
            {product.price.toFixed(2)} zł
          </div>

          <div className="space-y-4">
            <p className="text-gray-800 leading-relaxed">{product.description}</p>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700 font-medium">Dostępność:</span>
              <span className={`text-sm font-medium ${
                product.stock > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {product.stock > 0 ? `${product.stock} sztuk` : 'Brak w magazynie'}
              </span>
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-800">Ilość:</label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="px-3 py-2 text-gray-700 hover:text-gray-900 disabled:text-gray-400"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x border-gray-300 text-gray-900 font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                  className="px-3 py-2 text-gray-700 hover:text-gray-900 disabled:text-gray-400"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 btn-primary py-3 px-6 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Dodaj do koszyka</span>
              </button>
              
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Heart className="h-5 w-5 text-gray-600" />
              </button>
              
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            
            {/* Stock Notification Form */}
            <StockNotificationForm 
              productId={product.id}
              productName={product.name}
              stock={product.stock}
            />
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t pt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Podobne produkty
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
