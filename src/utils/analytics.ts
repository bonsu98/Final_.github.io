import { Product, CartItem, Order } from '../types';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Track Add to Cart event for Google Analytics 4
 */
export const trackAddToCart = (product: Product, quantity: number, customPrice?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    const price = customPrice ?? product.price;
    window.gtag('event', 'add_to_cart', {
      currency: 'USD',
      value: price * quantity,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          price: price,
          quantity: quantity
        }
      ]
    });
  }
};

/**
 * Track Begin Checkout event for Google Analytics 4
 */
export const trackBeginCheckout = (cart: CartItem[]) => {
  if (typeof window !== 'undefined' && window.gtag && cart.length > 0) {
    const totalValue = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    window.gtag('event', 'begin_checkout', {
      currency: 'USD',
      value: totalValue,
      items: cart.map(item => ({
        item_id: item.product.id,
        item_name: item.product.name,
        item_category: item.product.category,
        price: item.product.price,
        quantity: item.quantity
      }))
    });
  }
};

/**
 * Track Purchase event for Google Analytics 4
 */
export const trackPurchase = (order: Order) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: order.id,
      currency: 'USD',
      value: order.total,
      shipping: 0, // Modify if shipping costs are added later
      tax: 0, // Modify if taxes are added later
      items: order.items.map(item => ({
        item_id: item.productId,
        item_name: item.name,
        price: item.priceAtPurchase,
        quantity: item.quantity
      }))
    });
  }
};
