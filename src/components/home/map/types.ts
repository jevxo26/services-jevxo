export type ExpertIcon =
  | "ac"
  | "cleaning"
  | "electric"
  | "plumbing"
  | "shifting"
  | "painting"
  | "cctv"
  | "salon"
  | "general";

export interface Expert {
  id: string;
  profileId: number;
  name: string;
  category: string;
  categories: string[];
  rating: number;
  reviews: number;
  badge: "Top Rated" | "Expert" | "Popular";
  location: string;
  address: string;
  division: string;
  district: string;
  divisionBangla?: string;
  districtBangla?: string;
  area: string;
  distance: string;
  status: string;
  description: string;
  price: number;
  lat: number;
  lng: number;
  icon: ExpertIcon;
  phone: string;
  completedJobs: number;
  avatar?: string;
  companyName?: string;
  userId: number;
  categoryIds: number[];
}
