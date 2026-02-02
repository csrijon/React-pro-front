import Contact from "./Contact"
import Suggestion from "./Suggestion"
import "./Contact.css"

const Contactroutepage = () => {
    return (
        <section className="Contact-routesection" >
            <Contact icon="/" />
            <Suggestion />
        </section>
    )
}
export default Contactroutepage