
import SearchIcon from '@mui/icons-material/Search';
import "../styles/Herosection.css"


const Herosection = () => {
    return (
        <section>
            <div className="title">
                <h1>Book beautiful services,</h1><br />
                <span>softly.</span>
            </div>
            <div className="sub-title" >
                <p>Find salons, tutors, and wellness studios near you — pressed from the same warm clay.</p>
            </div>
            <div className="secend-searchbar">
                <div className="search-bar">
                <SearchIcon/>
                <input type="text" placeholder='Find a service near you' />
                </div>
                <button>Search</button>
            </div>
            
            <div className="service-items">
                <div className="service-icon">🧘</div>
                <span>Fitness</span>
            </div>
            
        </section>
    )
}

export default Herosection