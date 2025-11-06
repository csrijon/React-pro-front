import "./Media.css"
import TwitterIcon from '@mui/icons-material/Twitter';

const Media = ()=>{
    return(
        <div className="media-container"> 
           <h2><span>#</span>all-media</h2>
           <div className="media-item">
            <a href=""><TwitterIcon/></a>
            <p>@srijon</p>
           </div>
        </div>
    )
}

export default Media;