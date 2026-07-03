import { PayPalButtons } from "@paypal/react-paypal-js";

function Home() {
  return (
    <>
      <h1>$100</h1>

      <PayPalButtons
        createOrder={async () => {
          const res = await fetch("http://localhost:5000/payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: "100.00",
            }),
          });

          const data = await res.json();

          return data.orderID;
        }}
        onApprove={async (data) => {
          const res = await fetch(
            `http://localhost:5000/capture/${data.orderID}`,
            {
              method: "POST",
            }
          );

          const result = await res.json();

          console.log(result);

          alert("Payment Success");
        }}
      />
    </>
  );
}

export default Home;