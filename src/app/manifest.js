export default function manifest() {
  return {
    name: 'Map App',
    short_name: 'Map App',
    description: 'Mike & Danielle&amp;s Map App',
    start_url: '/',
    display: 'standalone',
    background_color: '#000',
    theme_color: '#000',
    icons: [
      {
        src: '/apple-icon.png',
        sizes: 'any',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '400x400',
        type: 'image/png',
      },
      {
        src: '/apple-icon2.png',
        sizes: '180x180',
        type: 'image/png',
      }
    ],
  }
}