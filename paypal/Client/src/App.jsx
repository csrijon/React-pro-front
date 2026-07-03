import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Home from "./Home";

function App() {
  console.log(import.meta.env.VITE_PAYPAL_PUBLICKEY);

  return (
    <PayPalScriptProvider
      options={{
         clientId: import.meta.env.VITE_PAYPAL_PUBLICKEY,
      }}
    >
      <Home />
    </PayPalScriptProvider>
  );
}

export default App;