import AttraSymbol from "attra-hey-there/AttraSymbol";
import { NavLink } from "react-router-dom";
import './Logo.css';

export const Logo = () => (
  <NavLink to="/home" className="logo">
      {/* <span className="text attra-burn">
        ATTRA
        </span> */}
        <div className="logo-symbol">
          <span className="logo-text">.attra</span>
        </div>
  </NavLink>
);