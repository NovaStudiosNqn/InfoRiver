import "./navbar.css"
import logo from "../static/inforiver.png"

export default function Navbar() {
    return (
        <header className="navbar">
            <img src={logo} alt="InfoRiver logo" className="navbar-logo" />
            <div className="navbar-brand">
                <span className="navbar-title">InfoRiver</span>
                <span className="navbar-subtitle">Diario del hincha millonario</span>
            </div>
            <nav className="navbar-links">
                <a href="#" className="active">Portada</a>
                <a href="#">Noticias</a>
                <a href="#">Partidos</a>
                <a href="#">Plantel</a>
                <a href="#">Historia</a>
            </nav>
        </header>
    )
}