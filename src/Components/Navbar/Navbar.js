import Logo from "./logo-nav.svg";
import DatabaseLogo from "./logo-database-nav.svg";
import { Link } from "react-router-dom";
import "./style.css";

function Navbar({ Page }) {
  return (
    <nav
      className={`navbar w-100 ${Page === "database" ? "database-navbar" : ""}`}
    >
      <div className="container">
        <div className="logo">
          <img className="nav-logo" src={Logo} alt="logo" />
          <img className="base-logo" src={DatabaseLogo} alt="logo" />
        </div>
        <ul className="nav">
          <li className="nav-item text-uppercase">QUIZ MASTER</li>
          <li className="nav-item">
            <div className="line"></div>
          </li>
          <li className="nav-item text-uppercase">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
