import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Servicecard from "../ui/Servicecard"
import "../styles/Mainservicepage.css"
import services from "../Servicedata"

const Mainservicepage = () => {
    return (

        <section className='mainservicepage-section' >
            <div className="container mainservicepage-container ">
                <div className="top-title">
                    <h2>Popular near you</h2>
                    <div className="see-all-section">
                        <span>See all</span>
                        <  ArrowForwardIosIcon className='Arrow-icon' />
                    </div>
                </div>
                <div className="services-items">
                    {
                        services.map((items,id) => (
                            <Servicecard key={id} title={items.title} category={items.category} rating={items.rating} image={items.image} location={items.location}  />
                        ))
                    }

                </div>

            </div>
        </section>

    )
}
export default Mainservicepage