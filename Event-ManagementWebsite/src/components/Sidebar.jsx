import "../css/Sidebar.css"


const Sidebar = () => {
    return (
        <aside className="sidebar">
            <h2 className="logo">Dashboard</h2>
            <ul className="menu">
                <li><a href="">Dashboard</a></li>
                <li><a href="">Home</a></li>
                <li className="active"><a href="">Suppliers</a></li>
                <li><a href="">About</a></li>
                <li><a href="">Media</a></li>
                <li><a href="">Contact</a></li>
            </ul>
        </aside>
    )
}

export default Sidebar