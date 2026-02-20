import { useEffect, useState } from "react";
import axios from 'axios'
function App(){
    let [data,setdata]=useState({message:"connecting..."})
    useEffect(()=>{
        axios.get('http://127.0.0.1:8000/first/').then(
            res=>setdata(res.data)
        ).catch(err=>setdata({message:"connection failed! check CORS settings."}))

    },[])
    return(
        <>
        <div>AI Resume Checker</div>
        <div>
            <p>{data.status}</p>
            <p>{data.message}</p>
        </div>
        </>
    );
}
export default App;