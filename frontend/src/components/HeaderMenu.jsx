import { HiMiniEllipsisVertical } from "react-icons/hi2";
import Menu from "./Menu";
import { useState } from "react";

const HeaderMenu = ()=> {
    const [menuActive, setMenuActive]= useState(false)

    return(
        <div className="header-menu">
            <Menu menuActive={menuActive}/>
            <HiMiniEllipsisVertical size={25} onClick={()=> setMenuActive(!menuActive)}/>
        </div>
    )
}

export default HeaderMenu;