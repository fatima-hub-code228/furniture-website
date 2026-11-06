import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Heart,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import {
  CartItem,
  calculateCartSummary,
  FurnitureProduct,
  PRODUCTS,
} from '../data/catalog';

interface CartAndWishlistDrawerProps {
  isOpen: boolean;
  activeTab: 'cart' | 'wishlist';
  onSwitchTab: (tab: 'cart' | 'wishlist') => void;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, finishName: string, delta: number) => void;
  onRemoveCartItem: (productId: string, finishName: string) => void;
  onClearCart: () => void;
  wishlistProducts: FurnitureProduct[];
  onRemoveWishlist: (productId: string) => void;
  onMoveWishlistToCart: (product: FurnitureProduct) => void;
}

export const CartAndWishlistDrawer: React.FC<CartAndWishlistDrawerProps> = ({
  isOpen,
  activeTab,
  onSwitchTab,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveCartItem,
  onClearCart,
  wishlistProducts,
  onRemoveWishlist,
  onMoveWishlistToCart,
}) => {
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [clientName, setClientName] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  if (!isOpen) return null;

  const summary = calculateCartSummary(cartItems, PRODUCTS);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (!clientName.trim() || !deliveryCity.trim()) {
      setCheckoutError(
        'Please enter your name and destination city for white-glove showroom delivery.'
      );
      return;
    }
    setCheckoutError(null);
    setOrderCompleted(true);
    onClearCart();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Showroom Bag and Saved Wishlist"
      className="fixed inset-0 z-50 flex justify-end bg-[#080808]/85 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-lg bg-[#17120D] text-white h-full flex flex-col justify-between border-l border-[#D6A342]/40 shadow-[0_0_80px_rgba(0,0,0,0.95)]">
        {/* Top Drawer Header & Tab Switcher */}
        <div className="p-6 border-b border-[#D6A342]/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onSwitchTab('cart');
                setOrderCompleted(false);
              }}
              className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'cart'
                  ? 'bg-[#D6A342] text-[#080808] font-bold'
                  : 'bg-[#080808] text-[#D8CFC2] border border-[#D6A342]/30 hover:text-[#FFC857]'
              }`}
            >
              Showroom Bag ({summary.itemCount})
            </button>
            <button
              type="button"
              onClick={() => {
                onSwitchTab('wishlist');
                setOrderCompleted(false);
              }}
              className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'wishlist'
                  ? 'bg-[#D6A342] text-[#080808] font-bold'
                  : 'bg-[#080808] text-[#D8CFC2] border border-[#D6A342]/30 hover:text-[#FFC857]'
              }`}
            >
              Saved Pieces ({wishlistProducts.length})
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Drawer"
            className="p-2 text-[#D8CFC2] hover:text-[#FFC857] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'cart' ? (
            orderCompleted ? (
              <div className="py-12 px-6 text-center bg-[#080808] border border-[#D6A342]/45">
                <CheckCircle2 className="w-12 h-12 text-[#FFC857] mx-auto mb-4" />
                <h3
                  className="text-2xl font-serif text-white mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Private Showroom Reservation Confirmed
                </h3>
                <p className="text-sm text-[#D8CFC2] mb-6">
                  Thank you, <strong className="text-[#FFC857]">{clientName}</strong>. Our master
                  installation team has scheduled your white-glove delivery to{' '}
                  <strong className="text-[#FFC857]">{deliveryCity}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setOrderCompleted(false);
                    onClose();
                  }}
                  className="px-6 py-3 bg-[#D6A342] text-[#080808] font-bold text-xs font-mono uppercase tracking-widest cursor-pointer"
                >
                  Return to 3D Showroom
                </button>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="py-16 text-center">
                <ShoppingBag className="w-10 h-10 text-[#D6A342] mx-auto mb-3" />
                <p className="text-lg font-serif text-white mb-1">Your Showroom Bag is Empty</p>
                <p className="text-xs text-[#C8B99E]">
                  Explore our 3D pedestals or collections below to curate your space.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const product = PRODUCTS.find((p) => p.id === item.productId);
                  if (!product) return null;
                  return (
                    <div
                      key={`${item.productId}-${item.finishName}`}
                      className="flex gap-4 p-4 bg-[#080808] border border-[#D6A342]/30"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 object-cover border border-[#D6A342]/30 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-base font-serif text-white truncate">
                            {product.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => onRemoveCartItem(item.productId, item.finishName)}
                            aria-label={`Remove ${product.name}`}
                            className="text-[#8E7F68] hover:text-[#FFC857] cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs font-mono text-[#C8B99E] mb-3">
                          Finish: {item.finishName}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="inline-flex items-center border border-[#D6A342]/35 bg-[#17120D]">
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateQuantity(item.productId, item.finishName, -1)
                              }
                              aria-label={`Decrease quantity of ${product.name}`}
                              className="p-1.5 text-[#D8CFC2] hover:text-[#FFC857] cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-xs font-mono text-white">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateQuantity(item.productId, item.finishName, 1)
                              }
                              aria-label={`Increase quantity of ${product.name}`}
                              className="p-1.5 text-[#D8CFC2] hover:text-[#FFC857] cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-sm font-mono font-semibold text-[#FFC857]">
                            ${(product.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* White-Glove Checkout Form */}
                <form
                  onSubmit={handleCheckout}
                  noValidate
                  className="mt-6 pt-6 border-t border-[#D6A342]/30 space-y-4"
                >
                  <h4 className="text-xs font-mono uppercase tracking-[0.18em] text-[#FFC857]">
                    White-Glove Architectural Dispatch
                  </h4>

                  <div>
                    <label
                      htmlFor="checkout-client-name"
                      className="block text-xs text-[#C8B99E] mb-1"
                    >
                      Client or Principal Architect Name
                    </label>
                    <input
                      id="checkout-client-name"
                      type="text"
                      value={clientName}
                      onChange={(e) => {
                        setClientName(e.target.value);
                        if (checkoutError) setCheckoutError(null);
                      }}
                      placeholder="e.g., Elena Vance"
                      className="w-full px-3 py-2 bg-[#080808] border border-[#D6A342]/40 text-sm text-white placeholder-[#8E7F68]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="checkout-city"
                      className="block text-xs text-[#C8B99E] mb-1"
                    >
                      Destination Residence City
                    </label>
                    <input
                      id="checkout-city"
                      type="text"
                      value={deliveryCity}
                      onChange={(e) => {
                        setDeliveryCity(e.target.value);
                        if (checkoutError) setCheckoutError(null);
                      }}
                      placeholder="e.g., Beverly Hills, CA"
                      className="w-full px-3 py-2 bg-[#080808] border border-[#D6A342]/40 text-sm text-white placeholder-[#8E7F68]"
                    />
                  </div>

                  {checkoutError && (
                    <p role="alert" className="text-xs text-[#FFC857] font-medium">
                      {checkoutError}
                    </p>
                  )}

                  <div className="bg-[#080808] p-4 border border-[#D6A342]/30 space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-[#C8B99E]">
                      <span>Subtotal</span>
                      <span className="text-white">${summary.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[#C8B99E]">
                      <span>White-Glove Delivery</span>
                      <span className="text-[#FFC857]">
                        {summary.whiteGloveDelivery === 0
                          ? 'Complimentary'
                          : `$${summary.whiteGloveDelivery}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold text-[#FFC857] pt-2 border-t border-[#D6A342]/25">
                      <span>Total Reservation</span>
                      <span>${summary.total.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-5 bg-gradient-to-r from-[#D6A342] to-[#FFC857] text-[#080808] text-xs font-mono uppercase tracking-[0.2em] font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Confirm White-Glove Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )
          ) : wishlistProducts.length === 0 ? (
            <div className="py-16 text-center">
              <Heart className="w-10 h-10 text-[#D6A342] mx-auto mb-3" />
              <p className="text-lg font-serif text-white mb-1">No Saved Pieces Yet</p>
              <p className="text-xs text-[#C8B99E]">
                Tap the heart icon on any piece to curate your private lookbook.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-4 bg-[#080808] border border-[#D6A342]/30 items-center"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ objectPosition: product.imagePosition || 'center center' }}
                    className="w-20 h-20 object-cover border border-[#D6A342]/30 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-serif text-white truncate">{product.name}</h4>
                    <p className="text-xs font-mono text-[#FFC857] mb-2">
                      ${product.price.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onMoveWishlistToCart(product)}
                        className="px-3 py-1.5 bg-[#D6A342] text-[#080808] font-bold text-[11px] font-mono uppercase tracking-wider cursor-pointer"
                      >
                        Move to Bag
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveWishlist(product.id)}
                        className="px-2.5 py-1.5 text-[11px] font-mono text-[#C8B99E] hover:text-[#FFC857] cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
