import React from "react"
import { useNavigate } from "react-router-dom"

export default function Home () {
    const navigate = useNavigate()
    return(
    <>
    
    <button onClick={()=>navigate('/sign_up')}>
        signUp
    </button>
    </>
    )
}