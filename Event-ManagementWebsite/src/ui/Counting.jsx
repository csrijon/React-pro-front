import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import "../css/Category.css";

const Countiing =()=>{
    return(
       <div className="counting">
                <KeyboardDoubleArrowLeftIcon className="arrow" />
                <p className="numbering">1</p>
                <p className="numbering">2</p>
                <p className="numbering">3</p>
                <KeyboardDoubleArrowRightIcon className="arrow" />
            </div>
    )
}

export default Countiing