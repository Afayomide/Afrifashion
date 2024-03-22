import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"

export default function ItemsInfo() {
    const [item, setItem] = useState([])
    const {id} = useParams()

    useEffect(()=>{
  async function fetchData(){
       const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/aboutItem`, {
        id
     })
        setItem(response.data.item)
  } 

  fetchData()
 })
    return(
        <div>
<img src={item.image}/>
        </div>
    )
}