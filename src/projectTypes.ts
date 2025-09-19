import { ReactElement,CSSProperties } from "react"

export type TUser = {
  email: string,
  name: string,
  image?: string,
}
export type TGeolocation = {
  lat: number, 
  lng: number
}
export type TViewport = {
  east:number, 
  west:number, 
  north:number, 
  south:number
}
export type TPhoto = {
  url:string,
  width:number,
  height:number
} | string
export type TPlaceDetails = {
    website?:string, 
    formatted_address?:string, 
    photos?:TPhoto[]
    international_phone_number?:string,
    url?:string 
      id: string|number,
        title: string, 
}
export type TPin = {
  createdBy: TUser,
  description?: string, 
  location:TGeolocation
  url?: string, 
  viewport: TViewport,
  favorited?:boolean,
  visited?:boolean,
  icon?:string,
  layerId:number,
  photos?: string[],
  photos_uploaded?:string
} & TPlaceDetails

export type TPinTemp = Omit<TPin & {
  place_id:string,
  name:string, 
  geometry: google.maps.places.Place,
  new?:boolean
},"id"|"title"|"createdBy">

export type TPinValues = {
  id?:string|number,
  createdBy?:TUser,
  description?:string, 
  formatted_address?:string, 
  international_phone_number?:string, 
  layerId?:number, 
  location?:TGeolocation,
  title?:string, 
  url?:string, 
  viewport?: TViewport,
  website?:string, 
  favorited?:boolean,
  visited?:boolean,
  icon?:string ,
  photos?:string[],
  photos_uploaded?:string
}
export type TLayer = {
  id:number,
  color: string, 
  created: TUser,
  icon?: string, 
  lightOrDark: string, 
  title: string,
  pins: TPin[] 

}


export type TMap = {
  id: number,
  created_at: string,
  createdBy: TUser,
  isArchived: boolean,
  mapIcon?: string, 
  title: string, 
  sortOrder: number,
  modified_at: string,
  layerData: TLayer[]
}

export type THomepageMap = Omit<TMap & {
  pinCount: number, 
  markerString: string
},"layerData">


export type TMapUpdateValues = {
  title?: string,
  sortOrder?: number, 
  isArchived?:boolean, 
  mapIcon?: string, 
  modified_at?: string, 
  layerData?: TLayer[]
}

export type TSvgImgUrl = {
  icon:string, 
  picker?:boolean,
  favorited?:boolean,
  visited?:boolean,
  ld?:"light"|"dark",
  hasIcon?: boolean,
  color?:string
}

