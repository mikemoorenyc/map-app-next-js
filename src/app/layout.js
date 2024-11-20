
import "./globalCSS/reset.css";
import "./globalCSS/rootVariables.css"
import "./globalCSS/scaffold.css"
import "./globalCSS/utilities.css"
import "./maps/[id]/Mobile/styles.css"


export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Also supported by less commonly used
  // interactiveWidget: 'resizes-visual',
}



export const metadata = {
  title: "Map App",
  description: "Mike & Danielle's Map App",
  appleWebApp: {
    capable: true,
  }

};

export default async function RootLayout({ children }) {
  
  return (
    <html lang="en">
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