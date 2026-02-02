
export enum ProductCategory {
  ANKARA = "Ankara",
  ASO_OKE = "Aso Oke",
  DANSIKI = "Dansiki",
  LACE = "Lace",
}

export enum ProductGender {
  MALE = "Male",
  FEMALE = "Female",
  UNISEX = "Unisex",
}

export enum ProductType {
  FABRIC = "Fabric",
  CLOTHING = "Clothing",
  ACCESSORY = "Accessory",
  FOOTWEAR = "Footwear",
}

export enum NigerianTribe {
  YORUBA = "Yoruba",
  IGBO = "Igbo",
  HAUSA = "Hausa",
  FULANI = "Fulani",
  EFIK = "Efik",
  IBIBIO = "Ibibio",
  TIVS = "Tivs",
  OTHER = "Other",
}

export interface IProduct {
    id: string;
  name: string;
  category: ProductCategory;
  color: string;
  status: string;
  type: ProductType;
  gender: ProductGender;
  image: string;
  images: string[];
  new: boolean;
  tribe: NigerianTribe;
  price: number;
  quantity: number;
  description: string[];
  instructions: string[];
  reviews: string[];
  stock: string;
  pattern?: string;
  createdAt: Date;
  updatedAt: Date;
}
