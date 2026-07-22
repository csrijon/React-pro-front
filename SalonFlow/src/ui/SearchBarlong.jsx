
import SearchIcon from '@mui/icons-material/Search';
import "../styles/SearchBarlong.css"


const SearchBarlong = () => {
    return (

        <div className='container searchbar-container ' >
            <div className="search-long-bar">
                <SearchIcon />
                <input type="text" placeholder='Search Provider' />
            </div>
        </div>

    )
}

export default SearchBarlong