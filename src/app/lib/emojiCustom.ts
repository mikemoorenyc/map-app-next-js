export const spriteSheet = "https://cdn.jsdelivr.net/npm/@emoji-mart/data/sets/14/twitter.json"
export const customEmojis = [

      {
        id: 'custom-museum',
        group:"custom-icons",
        names: ['museum','art','history'],
        imgUrl:  '/map-icons/museum.svg'
      },
      {
        id: 'custom-bbq',
        group:"custom-icons",
        names: ['barbecue','barbeque','bbq','grill','wok','picnic'],
        imgUrl:  '/map-icons/bbq.png',
      },
      {
        id: 'custom-goose',
        group:"custom-icons",
        names: ["goose","geese","fowl","bird","duck"],
        imgUrl:'/map-icons/goose.png' ,
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
