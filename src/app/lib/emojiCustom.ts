export const spriteSheet = "https://cdn.jsdelivr.net/npm/@emoji-mart/data/sets/14/twitter.json"
export const customEmojis = [
  {
    id: 'mapicons',
    name: 'Map Icons',
    emojis: [
      {
        id: 'custom-museum',
        name: 'Museum',
        keywords: ['museum','art','history'],
        skins: [{ src: '/map-icons/museum.svg' }],
      },
      {
        id: 'custom-bbq',
        name: 'Barbecue',
        keywords: ['barbecue','barbeque','bbq','grill','wok','picnic'],
        skins: [{ src: '/map-icons/bbq.png' }],
      },
      {
        id: 'custom-goose',
        name: 'Goose',
        keywords: ["goose","geese","fowl","bird","duck"],
        skins: [{ src: '/map-icons/goose.png' }],
      },

    ],
  },

]
export const customCategoryIcons = {
  categoryIcons: {

    mapicons: {
      src: '/map-icons/museum.svg',
    },
  },
}
export const pickerOptions = {
  autoFocus: true,
  maxFrequentRows: 1,
  set: "twitter",
  custom: customEmojis,
  categoryIcons: customCategoryIcons,
  previewPosition: "none",
  data: async () => {
      const response = await fetch(
    spriteSheet,
  )

  return response.json()
}
}
