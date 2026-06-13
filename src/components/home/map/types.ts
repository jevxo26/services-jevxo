export interface Expert {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  badge: "Top Rated" | "Expert" | "Popular";
  location: string;
  distance: string;
  status: string;
  description: string;
  price: number;
  coords: { x: number; y: number };
  icon: "ac" | "cleaning" | "electric" | "plumbing" | "shifting" | "painting" | "cctv" | "salon";
  phone: string;
  completedJobs: number;
}
