import {create} from "zustand"
import type { TempData ,TRoute} from "./MobileActiveContext"
import type { TGeolocation } from "@/projectTypes"

type DrawerStates = "minimized"|"maximized"|"open"|"editing";
type BackButtonStates = "base"|"back"|"back_to_base"|"back_to_legend"
type TActiveData = {
  disabledLayers: number[],
  activePin:null|string|number, 
  legendOpen:boolean,
  drawerState:DrawerStates,
  tempData: null|TempData
  expandedLayers:number[],
  backState: BackButtonStates,
  inBounds:boolean,
  geolocation: null | TGeolocation,
  routes: null| {
        TRANSIT: TRoute
    },
  colorMode:"light"|"dark",
  canEdit:boolean,
  firstLoad:false|"local"|"server",
  
}
type ActiveAction<T> = (value:T) => void
type TActiveActions = {
    updateCanEdit: ActiveAction<boolean>
    updateFirstLoad: ActiveAction<"local"|"server"|false>,
    updateColorMode: ActiveAction<"light"|"dark">,
    updateGeolocation: ActiveAction<TGeolocation>,
    updateRoutes: (reset?:boolean,updatedRoute?:{TRANSIT:TRoute})=>void,
    updateInBounds: ActiveAction<boolean>,
    updateActivePin: ActiveAction<string|number|null>,
    updateTempData: ActiveAction<TempData>,
    updateExpandedLayer: (state:"expanded"|"collapsed",id:number)=>void,
    updateDisabledLayer: (disabled:boolean,id:number)=>void,
    updateLegendOpen: ActiveAction<boolean>,
    updateDrawerState: ActiveAction<DrawerStates>,
    updateBackState: ActiveAction<BackButtonStates>

}
const initData: TActiveData = {
    disabledLayers:[],
    activePin:null,
    legendOpen:false ,
    drawerState:"minimized",
    tempData:null,
    expandedLayers:[],
    inBounds:false,
    geolocation:null,
    routes:null,
    firstLoad:false,
    colorMode:"light",
    canEdit:true,
    backState:"base"
}




export const useActiveStore = create<TActiveData&TActiveActions> ( (set,get) => {
    const actions = {
        updateBackState:(backState:BackButtonStates) => set({backState}),
        updateLegendOpen: (legendOpen:boolean) => set({legendOpen}),
        updateActivePin: (activePin:string|number|null)=>set({activePin}),
        updateCanEdit: (canEdit:boolean) => set({canEdit}),
        updateFirstLoad:(firstLoad:"local"|"server"|false) => set({firstLoad}),
        updateTempData:(tempData:TempData)=>set({tempData}) ,
        updateColorMode:(colorMode:"light"|"dark") => set({colorMode}),
        updateGeolocation: (geolocation:TGeolocation)=>set({geolocation}),
        updateDrawerState: (drawerState:DrawerStates) => set({drawerState}),
        updateInBounds: (inBounds:boolean) => set({inBounds}),
        updateRoutes : (reset?:boolean,updatedRoute?:{TRANSIT:TRoute})=> {
            if(reset || !updatedRoute) {
                return set({routes:null})
            }
            const currentRoutes = get().routes;
            return set({routes: {...currentRoutes,...updatedRoute}})
        },
        updateExpandedLayer:(state:"expanded"|"collapsed",id:number) => {
            const current = get().expandedLayers;
            if(state == "expanded") {
                return set({expandedLayers:[...current,...[id]]})
            }
            return set({expandedLayers:current.filter(l=>l!==id)})
        },
        updateDisabledLayer :(disabled:boolean,id:number) => {
            const current = get().disabledLayers
            if(disabled) {
                return set({disabledLayers:[...current,...[id]]})
            }
            return set({disabledLayers: current.filter(l=>l!==id)})
        }
    }
    return {...actions,...initData}; 

})

export default useActiveStore;

