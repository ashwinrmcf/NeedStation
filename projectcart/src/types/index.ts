export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  selected: boolean;
}

export interface Address {
  fullName: string;
  mobile: string;
  flatNo: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  type: 'home' | 'work' | 'other';
  saveAddress: boolean;
}

export interface MapLocation {
  lat: number;
  lng: number;
}