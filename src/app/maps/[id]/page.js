"use client"
import { useRouter } from 'next/navigation'
import { useEffect,use } from 'react'
import { getMapData } from '@/app/actions/maps';
export default function Map({params}) {
  const id = use(params).id;

  console.log(id);

  return <div>
  asdasdf
  </div>
}