
import "./globalCSS/reset.css";
import "./globalCSS/rootVariables.css"
import "./globalCSS/scaffold.css"
import "./globalCSS/utilities.css"
//import "./maps/[id]/Mobile/styles.css"
import {Inter, Sofia_Sans} from "next/font/google"


export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  
  // Also supported by less commonly used
  // interactiveWidget: 'resizes-visual',
}
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
})
const sofiaSans = Sofia_Sans({
  subsets:["latin"],
  variable: "--font-sofiaSans"
})


export const metadata = {
  title: "Map App",
  description: "Mike & Danielle's Map App",
  appleWebApp: {
    capable: true,
    title: "Map App"
  }  

};


export default async function RootLayout({ children }) {

  
  
  return (
    <html lang="en" className={`${inter.variable} ${sofiaSans.variable}`}>
      <body >
      
        {children}
        <div id="menu-container"></div>
        <div id="portal-container"></div>
     
        
      </body>
    </html>
  );
}

/*
   <form
      action={async () => {
        "use server"
        await signIn("google",{ redirectTo: "/" })
      }}
    >
      <button type="submit">Signin with Google</button>
    </form>
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <button type="submit">Sign Out</button>
    </form>
    */