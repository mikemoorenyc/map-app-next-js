import { create } from 'zustand'

type TPinItemRef = {
    id:string|number,
    ref:HTMLDivElement
}

export type TActiveStore = {
    hovering:null|number|string,
    updateHovering:(id:number|null|string) => void,
    canEdit: boolean,
    updateCanEdit:(t:boolean)=>void
    editingLayer: null|number,
    updateEditingLayer: (l:null|number) => void,
    layerPanelRef: HTMLDivElement|null,
    setLayerPanelRef: (r:HTMLDivElement) =>void ,
    updateActiveLayer : (l:null|number) => void,
    activeLayer: number|null,
    collapsedLayers:number[],
    updateCollapsedLayers: (id:number,remove?:boolean)=>void,
    staticMode: boolean,
    updateStaticMode: (t:boolean) => void,
    editingPin: string|number|null,
    updateEditingPin:(p:string|number|null)=>void,
    pinItemRefs: TPinItemRef[],
    addPinItemRefs : (r:TPinItemRef) =>void

}




export const useActiveStore = create<TActiveStore>((set) => ({
    hovering:null,
    updateHovering: (id:number|null|string) => set({hovering:id}),
    canEdit: true,
    updateCanEdit: (t:boolean) => (set({canEdit:t})),
    editingLayer:null,
    updateEditingLayer: (l:null|number) => set({editingLayer:l}),
    setLayerPanelRef: (r:HTMLDivElement)=>set({layerPanelRef:r}),
    layerPanelRef: null,
    activeLayer: null,
    updateActiveLayer: (l:null|number) => set({activeLayer:l}),
    collapsedLayers:[],
    updateCollapsedLayers:(id:number,remove=false)=> {

        return set((state)=> {
            
            if(!remove) {
          
                return {
                    collapsedLayers: [...state.collapsedLayers, ...[id]]
                }
            }
            return {
                collapsedLayers:state.collapsedLayers.filter(l => l!==id)
            }
        })
    },
    staticMode:false, 
    updateStaticMode:(t:boolean) => set({staticMode:t}),
    editingPin:null, 
    updateEditingPin:(p:string|number|null)=>{
        
        return set((state)=> {
  
            return {editingPin:p}
        })
    },
    pinItemRefs:[],
    addPinItemRefs: (p:TPinItemRef)=>set((state)=> {
        return {
            pinItemRefs: [...state.pinItemRefs,...[p]]
        }
    }),
}))

export default useActiveStore;