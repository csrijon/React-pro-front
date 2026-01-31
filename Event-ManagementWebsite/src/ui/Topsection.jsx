import "../css/Topsection.css"

const Topsection = ({title,number}) => {
    return (
        <section>
            <div className="container">
            <div className="top-section">
                <p className="heading" >{title}</p>
                <p className="view-all" >View All({number})</p>
            </div>
            </div>
        </section>
    )
}
export default Topsection