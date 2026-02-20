import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/shopify';

export default function CartDrawer() {
  const {
    cartItems,
    cartCount,
    cartTotal,
    checkoutUrl,
    isCartOpen,
    isLoading,
    closeCart,
    updateQuantity,
    removeItem,
  } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[55] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5" />
                <h2 className="text-lg font-medium">Your Cart</h2>
                {cartCount > 0 && (
                  <span className="bg-black text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
                  <p className="text-gray-500 mb-2">Your cart is empty</p>
                  <p className="text-sm text-gray-400">
                    Add prosthetic supplies to get started
                  </p>
                </div>
              ) : (
                <ul className="space-y-6">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                      isLoading={isLoading}
                    />
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-100 p-6 space-y-4">
                {/* Insurance reminder */}
                <div className="bg-brand-offwhite p-4 rounded-lg">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    <strong>Have insurance?</strong> Many prosthetic supplies are covered by insurance.
                    Check your benefits before purchasing out-of-pocket.
                  </p>
                </div>

                {/* Subtotal */}
                <div className="flex items-center justify-between text-lg">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold">{formatPrice(cartTotal)}</span>
                </div>

                <p className="text-xs text-gray-500">
                  Shipping and taxes calculated at checkout
                </p>

                {/* Checkout Button */}
                <a
                  href={checkoutUrl}
                  className={`
                    block w-full bg-black text-white text-center py-4 rounded-full font-bold
                    transition-all duration-300 hover:bg-gray-800
                    ${isLoading ? 'opacity-50 pointer-events-none' : ''}
                  `}
                >
                  {isLoading ? 'Updating...' : 'Checkout'}
                </a>

                <button
                  onClick={closeCart}
                  className="block w-full text-center py-3 text-sm text-gray-500 hover:text-black transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CartItem({ item, onUpdateQuantity, onRemove, isLoading }) {
  const { merchandise } = item;
  const product = merchandise.product;
  const image = product.images?.edges?.[0]?.node;

  return (
    <li className="flex gap-4">
      {/* Product Image */}
      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        {image ? (
          <img
            src={image.url}
            alt={image.altText || product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-gray-300" />
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm leading-tight mb-1 truncate">
          {product.title}
        </h3>
        {merchandise.title !== 'Default Title' && (
          <p className="text-xs text-gray-500 mb-2 truncate">
            {merchandise.title}
          </p>
        )}
        <p className="font-bold text-sm">
          {formatPrice(merchandise.price.amount)}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center border border-gray-200 rounded-full">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={isLoading}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-3 text-sm font-medium min-w-[2rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              disabled={isLoading}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={() => onRemove(item.id)}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </li>
  );
}
