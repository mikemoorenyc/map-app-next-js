import dummyPlace from "./testDetails";
import { NextRequest } from "next/server";
import holidays from "./holidays";

export  async function GET(req:NextRequest) {
  const {searchParams} = req.nextUrl;

  const type = searchParams.get("type");
  console.log(type);

  if(type === "place") {
    return new Response(
       JSON.stringify(dummyPlace)
      ,{
      status:200,
      headers: {
        "Content-Type": "application/json"
      }
    }
    )
  }
  if(type=="holidays") {
    return new Response(
       JSON.stringify(holidays)
      ,{
      status:200,
      headers: {
        "Content-Type": "application/json"
      }
    }
    )
  }

}