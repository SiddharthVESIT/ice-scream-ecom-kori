'use client';

import { useState } from 'react';
import Link from 'next/link';

interface CartItem {
    id: number;
    name: string;
    emoji: string;
    price: number;
    quantity: number;
}

const INITIAL_CART: CartItem[] = [
    { id: 3, name: 'Kyoto Matcha', emoji: '🍵', price: 16.80, quantity: 2 },
    { id: 1, name: 'Hokkaido Milk', emoji: '🥛', price: 14.80, quantity: 1 },
    { id: 5, name: 'Sakura Blossom', emoji: '🌸', price: 17.80, quantity: 1 },
];

export default function CheckoutPage() {
    const [cart, setCart] = useState<CartItem[]>(INITIAL_CART);
    const [orderPlaced, setOrderPlaced] = useState(false);

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 50 ? 0 : 5.00;
    const total = subtotal + shipping;

    const updateQuantity = (id: number, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const placeOrder = async () => {
        try {
            // 1. Create order
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:4000/api/v1/orders/razorpay/create', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount: total })
            });
            const data = await res.json();
            
            if (!data.orderId) throw new Error('Order creation failed');

            // 2. Open Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: data.amount,
                currency: "JPY",
                name: "Kori氷",
                description: "Premium Japanese Ice Cream",
                order_id: data.orderId,
                handler: async function (response: any) {
                    // 3. Verify Payment
                    const verifyRes = await fetch('http://localhost:4000/api/v1/orders/razorpay/verify', {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        })
                    });
                    
                    if (verifyRes.ok) {
                        setOrderPlaced(true);
                    } else {
                        alert('Payment verification failed.');
                    }
                },
                theme: {
                    color: "#A2C2A1" // kori-sage color
                }
            };
            
            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (err: any) {
            console.error('Checkout error', err);
            alert('Something went wrong during checkout: ' + err.message);
        }
    };

    if (orderPlaced) {
        return (
            <div className="wabi-sabi-bg min-h-screen flex items-center justify-center px-6">
                <div className="glass-card rounded-3xl p-12 max-w-md text-center animate-fade-in">
                    <span className="text-6xl block mb-6">✨</span>
                    <h1 className="font-display text-2xl font-semibold text-kori-charcoal mb-3">
                        Order Confirmed!
                    </h1>
                    <p className="text-sm text-kori-charcoal-light/50 mb-2">
                        Thank you for your order. Your artisanal ice cream is being carefully prepared.
                    </p>
                    <div className="bg-kori-sage/10 rounded-xl px-5 py-3 mb-6">
                        <p className="text-xs text-kori-sage font-medium">
                            🌿 Shipped with eco-friendly dry-ice packaging
                        </p>
                    </div>
                    <p className="text-xs text-kori-charcoal-light/30 mb-6">
                        You earned <span className="font-semibold text-kori-gold">{Math.floor(total * 10)} Kori Points</span> on this order!
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Link href="/dashboard" className="px-6 py-2.5 bg-kori-charcoal text-kori-cream rounded-full text-sm font-medium hover:bg-kori-sage transition-colors">
                            View Orders
                        </Link>
                        <Link href="/products" className="px-6 py-2.5 border border-kori-sage/30 text-kori-sage rounded-full text-sm font-medium hover:bg-kori-sage/10 transition-colors">
                            Keep Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="wabi-sabi-bg min-h-screen">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="font-display text-3xl font-bold text-kori-charcoal mb-2 text-center">
                    Your Cart
                </h1>
                <p className="text-sm text-kori-charcoal-light/40 text-center mb-10">
                    Review your selection before checkout
                </p>

                {cart.length === 0 ? (
                    <div className="text-center py-20">
                        <span className="text-5xl block mb-4">🧊</span>
                        <p className="text-kori-charcoal-light/40 mb-6">Your cart is empty</p>
                        <Link href="/products" className="px-6 py-2.5 bg-kori-charcoal text-kori-cream rounded-full text-sm font-medium hover:bg-kori-sage transition-colors">
                            Browse Flavors
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map(item => (
                                <div key={item.id} className="glass-card rounded-xl p-5 flex items-center gap-5">
                                    <span className="text-4xl">{item.emoji}</span>
                                    <div className="flex-1">
                                        <h3 className="font-display font-semibold text-kori-charcoal">{item.name}</h3>
                                        <p className="text-sm text-kori-charcoal-light/40">¥{item.price.toFixed(2)} / pint</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="w-8 h-8 rounded-full border border-kori-sage/20 flex items-center justify-center text-kori-sage hover:bg-kori-sage/10 transition-colors text-sm"
                                        >
                                            −
                                        </button>
                                        <span className="font-medium text-kori-charcoal w-6 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="w-8 h-8 rounded-full border border-kori-sage/20 flex items-center justify-center text-kori-sage hover:bg-kori-sage/10 transition-colors text-sm"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <span className="font-display font-semibold text-kori-charcoal min-w-[70px] text-right">
                                        ¥{(item.price * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="glass-card rounded-2xl p-6 sticky top-24">
                                <h3 className="font-display text-lg font-semibold text-kori-charcoal mb-5">
                                    Order Summary
                                </h3>
                                <div className="space-y-3 mb-5">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-kori-charcoal-light/50">Subtotal</span>
                                        <span className="text-kori-charcoal">¥{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-kori-charcoal-light/50">Shipping</span>
                                        <span className={shipping === 0 ? 'text-kori-sage font-medium' : 'text-kori-charcoal'}>
                                            {shipping === 0 ? 'Free' : `¥${shipping.toFixed(2)}`}
                                        </span>
                                    </div>
                                    {shipping > 0 && (
                                        <p className="text-[10px] text-kori-charcoal-light/30">
                                            Free shipping on orders over ¥50.00
                                        </p>
                                    )}
                                    <div className="border-t border-kori-sage/10 pt-3 flex justify-between">
                                        <span className="font-display font-semibold text-kori-charcoal">Total</span>
                                        <span className="font-display text-lg font-bold text-kori-charcoal">¥{total.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Eco Packaging Notice */}
                                <div className="bg-kori-sage/8 rounded-xl px-4 py-3 mb-5">
                                    <p className="text-xs text-kori-sage flex items-center gap-2">
                                        <span>🌿</span>
                                        Eco-friendly dry-ice packaging included
                                    </p>
                                </div>

                                {/* Points Earning */}
                                <div className="bg-kori-gold/8 rounded-xl px-4 py-3 mb-5">
                                    <p className="text-xs text-kori-gold flex items-center gap-2">
                                        <span>✦</span>
                                        Earn {Math.floor(total * 10)} Kori Points on this order
                                    </p>
                                </div>

                                <button
                                    onClick={placeOrder}
                                    className="w-full py-3 bg-kori-charcoal text-kori-cream rounded-full text-sm font-medium hover:bg-kori-sage transition-all duration-300 hover:scale-[1.02]"
                                >
                                    Pay with Razorpay
                                </button>

                                <p className="text-[10px] text-kori-charcoal-light/30 text-center mt-3">
                                    Secure checkout · 256-bit SSL encryption
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
