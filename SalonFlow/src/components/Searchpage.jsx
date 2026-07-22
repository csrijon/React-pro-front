import Leftsidecatagory from "../ui/Leftsidecatagory"
import services from "../Servicedata"
import Servicecard from "../ui/Servicecard"
import "../styles/Searchpage.css"

const Searchpage = () => {
    return (
        <>
            <div className="Searchpage">
                <div className="container searchpagecontainer ">
                    <Leftsidecatagory />
                    <div className="right-side">
                        <p>9 Provider</p>
                        <div className="services-items searchbar-items ">
                            {
                                services.map((items, id) => (
                                    <Servicecard key={id} title={items.title} category={items.category} rating={items.rating} image={items.image} location={items.location} />
                                ))
                            }

                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Searchpage