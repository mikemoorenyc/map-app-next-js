"use client"
import {create, useStore} from "zustand";
import { TLayer, TPin } from "@/projectTypes";
import type { ReactNode } from "react";
import { createContext,useContext,useState } from "react";


type TInitState = {
    title:string, 
    mapIcon?:string, 
    layerData: TLayer[],
    pinsFlat: TPin[],
    pinIds: (string|number)[],
    mapId: number
}

type TDataStore = {

    updateTitle : (title:string) => void,
    updateMapIcon: (icon:string) => void,
    updateLayerData: (layers:TLayer[]) => void
} & TInitState

const initState = {
    title:"",
    layerData:[],
    pinsFlat:[],
    pinIds:[],
    mapId:-1,
    mapIcon:""
}

export const createDataStore = (init:TInitState = initState) => {
    return create<TDataStore>((set) => ({
    ...init,
    updateTitle:(title:string)=>set({title}),
    updateMapIcon:(icon:string)=>set({mapIcon:icon}),
    updateLayerData:(layers:TLayer[])=>set({
        layerData:layers,
        pinsFlat:layers.flatMap(l=>l.pins),
        pinIds: layers.flatMap(l => {
            if(!l.pins) return [];
            return l.pins;
        }).map(p => p.id)
    })
    }))

}

//PROVIDER
type DataStoreApi = ReturnType<typeof createDataStore>

export const DataStoreContext = createContext<DataStoreApi|undefined>(undefined);

export const DataStoreProvider = ({
    children, init
}:{children:ReactNode, init:TInitState}) => {
    const [store] = useState(()=>createDataStore(init));
    return <DataStoreContext.Provider value={store}>
        {children}

    </DataStoreContext.Provider>

}

export const useDataStore = <T,>(selector:(store:TDataStore) =>T,):T => {
    const dataStoreContext = useContext(DataStoreContext);
    if(!dataStoreContext) {
        throw new Error("no context")
    }
    return useStore(dataStoreContext, selector); 

}

