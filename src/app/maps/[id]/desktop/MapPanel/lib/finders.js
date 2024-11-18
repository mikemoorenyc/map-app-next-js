const findPin = (layers,id) => {
  return layers.map(l=> {
    if (l?.pins) {
      return l.pins
    } else {
      return [];
    }
  }).flat().find(p => p.id == id)
}
const findLayer = (layers, id) => {
  return layers.find(l => l.id == id);
}
const isHighlighted = (activeData, pinId) => {
  return activeData.editingPin == pinId || activeData.hoveringPin == pinId
}

export {findPin,findLayer,isHighlighted};