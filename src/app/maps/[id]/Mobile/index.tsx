'use client'
import DataContext, { DataContextProvider } from "@/app/contexts/DataContext"
import { MobileActiveContextProvider } from "@/app/contexts/MobileActiveContext"
import MapPanel from "./MapPanel"
import "./styles.css";
import { FunctionComponent, ReactNode, useContext, useEffect } from "react";

import { memo} from "react";
import { ModalProvider } from "@/app/contexts/ModalContext";

import { TMap, TUser } from "@/projectTypes";
import LiveBlocksContainer from "@/app/components/LiveBlocksContainer/LiveBlocksContainer";
import Modal from "../sharedComponents/Modal";
import { SessionProvider } from "next-auth/react";

type TProps = {
  serverId:string,
  user:TUser,
}
const MapPanelMemo = memo(MapPanel);


const Interior= () => {
  return <MobileActiveContextProvider>
    <ModalProvider>
      <MapPanelMemo />

    </ModalProvider>
  </MobileActiveContextProvider>
}


const Mobile = ({map}:{map:TMap}) => {
  const nonEditing = useContext(DataContext).nonEditing;


  if(nonEditing) return  <Interior />

   


  

  return <LiveBlocksContainer {...{map}}>
<Interior />
</LiveBlocksContainer>
    



}

const Wrapper = ({ map }: { map: TMap;  }) => {
  if (!map) {
    return null;
  }

  useEffect(() => {
    sessionStorage.setItem("sessionStarted", "yes");
    localStorage.setItem("last-viewed", window.location.href.toLowerCase());
  }, []);

  return (
    <>
      <DataContextProvider serverId={String(map.id)} map={map} nonEditing={true}>
         <SessionProvider>
        <Mobile {...{map}}/>
        </SessionProvider>
      </DataContextProvider>
   

      <style jsx global>{`
        .GeoTag {
          font-size: 16px;
          display: block;
          will-change: transform;
          text-shadow: 1px 1px 0 black;
        }

        .mobile-app .gm-title {
          color: black;
        }

        html,
        body {
          max-width: 100vw;
          overflow-x: hidden;
          height: 100%;
          overflow-y: hidden;
        }
      `}</style>
    </>
  );
};

export default Wrapper;


/*



<LiveBlocksContainer {...{serverId,user}}>

<ModalProvider>
<DataContextProvider serverId={serverId} user={user}>
<MobileActiveContextProvider>

<MapPanelMemo />



</MobileActiveContextProvider>
</DataContextProvider>
</ModalProvider>

</LiveBlocksContainer>

*/