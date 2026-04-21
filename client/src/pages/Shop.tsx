import { Link } from "react-router-dom";
import "../components/Show_product/show.css";
import "./Shop.css";

export default function Shop() {
  return (
    <div className="shop-accueil">
      <h1 className="shop-accueil-titre">Shop</h1>
      <div className="shop-categories">
        <Link to="/shop/affiches" className="shop-categorie-card">
          <div className="shop-categorie-label">Affiches</div>
        </Link>
        <Link to="/shop/cartes" className="shop-categorie-card">
          <div className="shop-categorie-label">Cartes postales</div>
        </Link>
      </div>
    </div>
  );
}
