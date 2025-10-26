import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import axios from 'axios';

// Cart Context
const CartContext = createContext();

// Cart Actions
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};

// Cart Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      console.log('🔍 CartReducer - ADD_ITEM:', action.payload);
      console.log('🔍 CartReducer - Existing item found:', existingItem);
      console.log('🔍 CartReducer - Current items:', state.items);
      
      if (existingItem) {
        // Update quantity if item already exists
        console.log('📈 CartReducer - Updating quantity for existing item');
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      } else {
        // Add new item
        console.log('➕ CartReducer - Adding new item to cart');
        const newState = {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }]
        };
        console.log('✅ CartReducer - New state:', newState);
        return newState;
      }
    }
    
    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    
    case CART_ACTIONS.UPDATE_QUANTITY:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter(item => item.quantity > 0)
      };
    
    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: []
      };
    
    case CART_ACTIONS.LOAD_CART:
      return {
        ...state,
        items: action.payload || []
      };
    
    default:
      return state;
  }
};

// Initial State
const initialState = {
  items: []
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('needstation_cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cartData });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('needstation_cart', JSON.stringify(state.items));
  }, [state.items]);

  // Fetch pending bookings count
  useEffect(() => {
    const fetchPendingBookings = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        const response = await axios.get(`${API_URL}/bookings/user/${userId}`);
        if (response.data.success) {
          const bookings = response.data.bookings || [];
          // Count bookings that are pending or in progress
          const pendingCount = bookings.filter(b => 
            ['PENDING_WORKER_ASSIGNMENT', 'CONFIRMED', 'QUOTATION_PROVIDED', 'PAYMENT_PENDING'].includes(b.status)
          ).length;
          setPendingBookingsCount(pendingCount);
        }
      } catch (error) {
        console.error('Error fetching pending bookings:', error);
      }
    };

    fetchPendingBookings();
    
    // Refetch every 30 seconds to keep count updated
    const interval = setInterval(fetchPendingBookings, 30000);
    return () => clearInterval(interval);
  }, [API_URL]);

  // Cart Actions
  const addToCart = (service) => {
    console.log('🛒 CartContext - Adding to cart:', service);
    console.log('🛒 CartContext - Current cart items:', state.items);
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: service });
  };

  const removeFromCart = (serviceId) => {
    console.log('🗑️ Removing from cart:', serviceId);
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: serviceId });
  };

  const updateQuantity = (serviceId, quantity) => {
    console.log('🔄 Updating quantity:', serviceId, quantity);
    dispatch({ 
      type: CART_ACTIONS.UPDATE_QUANTITY, 
      payload: { id: serviceId, quantity } 
    });
  };

  const clearCart = () => {
    console.log('🧹 Clearing cart');
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  const isInCart = (serviceId) => {
    return state.items.some(item => item.id === serviceId);
  };

  const getCartItem = (serviceId) => {
    return state.items.find(item => item.id === serviceId);
  };

  const value = {
    // State
    cartItems: state.items,
    cartCount: getCartItemCount() + pendingBookingsCount, // Include pending bookings in count
    cartTotal: getCartTotal(),
    pendingBookingsCount, // Expose pending bookings count separately
    
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getCartItem
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook to use Cart Context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
