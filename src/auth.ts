import NextAuth from "next-auth"
import Google from "next-auth/providers/google" 

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({user}) {
      const emails = process.env.ALLOWED_USERS;
      if(!emails) return false; 
      const list = emails.split(",");
      if(!user.email) return false; 
      const allowed = list.includes(user?.email);
      if(!allowed) return false; 

      return true; 

    }

  },
  
  pages: {
    error: "/baduser"
  }
})