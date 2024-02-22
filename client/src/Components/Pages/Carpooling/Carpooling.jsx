import React from 'react'
import "./Carpooling.css"
  import { MenuItem, ListItemIcon } from '@mui/material'
  import view from"../../../assests/navicon/view.png"
  import post from "../../../assests/navicon/post.png"
  import { Link } from "react-router-dom";
import CarDetails from './CarDetails'
const Carpooling = () => {
  return (
    <>
    <div className='carpooling'>

              <MenuItem to="/postcarpooling"
                component={Link}
                >
                <ListItemIcon>
                  <img src={post} alt="Help" width={26} height={26} />
                </ListItemIcon>
           Create Carpooling
          </MenuItem>




    

    </div>
        <CarDetails/>
        </>
  )
}

export default Carpooling
