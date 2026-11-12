import type { CustomEmoji } from "emoji-picker-element/shared"
export const spriteSheet = "https://cdn.jsdelivr.net/npm/@emoji-mart/data/sets/14/twitter.json"
export const customEmojis: CustomEmoji[] = [

      {
        name: 'custom-museum',
       //group:"custom-icons",
        shortcodes: ['museum','art','history'],
        url:  '/map-icons/museum.svg'
      },
      {
        name: 'custom-bbq',
       // group:"custom-icons",
        shortcodes: ['barbecue','barbeque','bbq','grill','wok','picnic'],
        url:  '/map-icons/bbq.png',
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
