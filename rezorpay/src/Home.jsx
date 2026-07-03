

const Home = () => {

    const Handelpaybutton = async () => {
        const response = await fetch("http://localhost:5000/create-payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ammount: 100 * 100,
                currency: "INR"
            })
        })
        let datares = await response.json()
        console.log(datares)
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        // document.body.appendChild(script)

        script.onload = () => {
            let options = {
                "key": "rzp_test_T8zmMPRKJxchpJ",
                "amount": datares.order.amount,
                "currency": "INR",
                "name": 'Srijon KInfg',
                "order_id": datares.order.id,
                "theme": {
                    "color": "#3399cc"
                },
                handler: function (response) {
                    console.log(response)
                }
            }
            let rpz1 = new window.Razorpay(options)
            rpz1.open()
        }
        document.body.appendChild(script)


    }

    return (
        <div>
            <p>$100</p>
            <button onClick={Handelpaybutton} >Pay Now</button>
        </div>
    )
}

export default Home