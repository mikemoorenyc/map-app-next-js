import { User } from "next-auth";
import { TUser } from "@/projectTypes";
export default function(user:User|null):user is TUser {
    return user!==null&&(user&&typeof user.email =="string")&&(user&&typeof user.name == "string") ; 

}