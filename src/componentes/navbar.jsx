import "./navbar.css"
import logo from "../static/inforiver.png"

export default function Navbar() {
    return (
        <header className="navbar">
            <img src={logo} alt="InfoRiver logo" className="navbar-logo" />
            <div className="navbar-brand">
                <span className="navbar-title">InfoRiver96</span>
                <span className="navbar-subtitle">Diario del hincha millonario</span>
            </div>
            <nav className="navbar-links">
                <a href="#portada" className="active">Portada</a>
                <a href="#noticias">Noticias</a>
                <a href="#partidos">Partidos</a>
                <a href="#plantel">Plantel</a>
                <a href="#historia">Historia</a>
            </nav>
        </header>
    )
}
