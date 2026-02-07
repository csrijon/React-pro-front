import React,{useState,useEffect} from "react";
import "../css/suppliers.css";

// import photographer from "../assets/firstimage.webp";

const SuppliersCategories = () => {

  const [dataarray, setdataarray] = useState([])

  const responsedata = async () => {
    try {
      const response = await fetch("http://localhost:3000/supplyers")
      const data = await response.json()
      setdataarray(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    responsedata()
  }, [])
  
  return (
    <div className="suppliers-container">
      <div className="container">
        <h4 className="suppliers-title">Suppliers Categories</h4>

        <div className="suppliers-grid">
          {dataarray.map((item, index) => (
          <div className="supplier-card" key={index}>
            <div className="supplier-circle">
              <img src={item.Image} alt={item.title} />
            </div>
            <p className="supplier-text">{item.title}</p>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default SuppliersCategories;