import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header>
      <div className="container mx-auto px-8">
        <nav
          id="navbar"
          className="flex flex-wrap items-center justify-between mx-auto py-4"
        >
          <Link
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse abril-fatface-regular"
          >
            InnerVerse
          </Link>

          <ul className="links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/entry/new">New Entry</Link>
            </li>
            <li>
              <Link to="/entries">Entries</Link>
            </li>
            <li>
              <Link to="/analysis">Analysis</Link>
            </li>
            <li>
              <Link to="/signout">Log Out</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
