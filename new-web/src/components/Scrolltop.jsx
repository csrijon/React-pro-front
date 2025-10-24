
// import React ,{useEffect} from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Scrolltop = () => {
    const { pathname } = useLocation();
    console.log(pathname);
    useEffect(() =>{
     window.scrollTo(0,0);
    },[pathname])
  return null;
}

export default Scrolltop
