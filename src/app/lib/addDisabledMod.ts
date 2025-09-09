import { TModOptions } from "../components/Button";

export default function(mods:TModOptions[],disabled:boolean) {
  const nMods = [...mods];
  if(disabled) {
    nMods.push("disabled");
  }
  return nMods; 
}