export interface Parameter {
  name: string;
  value: string;
}

export interface Specifications {
  keyParameters?: Parameter[];
  bodyParameters?: Parameter[];
  engineParameters?: Parameter[];
  motorParameters?: Parameter[];
  wheelBrakeParameters?: Parameter[];
  keyConfigurations?: Parameter[];
  [key: string]: unknown;
}

export interface Vehicle {
  _id: string;
  brand: string;
  name: string;
  type: string;
  description?: string;
  images?: string[];
  specifications?: Specifications;
}
