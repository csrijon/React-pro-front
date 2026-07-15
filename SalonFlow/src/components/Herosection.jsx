
import SearchIcon from '@mui/icons-material/Search';
import "../styles/Herosection.css"
import Salondata from '../Salondata';


const Herosection = () => {
    return (
        <section className='Hero-section' >
            <div className="container Herosection-container ">
                <div className="title">
                    <h1>Book beautiful services,</h1>
                    <span>softly.</span>
                </div>
                <div className="sub-title" >
                    <p>Find salons, tutors, and wellness studios near you — pressed from the same warm clay.</p>
                </div>
                <div className="secend-searchbar">
                    <div className="search-bar">
                        <SearchIcon />
                        <input type="text" placeholder='Find a service near you' />
                    </div>
                    <button className='Search-btn' ><p>Search</p></button>
                </div>
                <div className="service-section">
                    {
                        Salondata.map((items, id) => (
                            <div key={id} className="service-items">
                                <div className="service-icon">{items.icon}</div>
                                <span>{items.item}</span>
                            </div>
                        ))
                    }
                </div>

            </div>
        </section>
    )
}

export default Herosection