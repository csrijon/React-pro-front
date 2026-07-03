


const App = () => {

    const onprojectpaypal = async ()=>{
      const response = await fetch("http://localhost:5000/payment",{
        method:"POST",
        headers:{
          "Content-Type": "application/json"
        },
        body:JSON.stringify({
          amount:100
        })
      })

      const resdata = await response.json()
      console.log(resdata)
    }

  return (
    <div>
      <p>58$</p>
      <p onClick={onprojectpaypal} >Pay</p>
    </div>
  )
}

export default App