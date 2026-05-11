import { Link } from "react-router-dom";
import affichesImg from "../assets/photo/DSC00121.jpg";
import cartesImg from "../assets/photo/dji_fly_20240617_211508_997_1719173233147_photo (3).jpg";
import "./Shop.css";

export default function Shop() {
  return (
    <div className="shop-accueil">
      <div className="shop-hero">
        <p className="shop-hero-sub">Collection</p>
        <h1 className="shop-hero-titre">La boutique</h1>
        <p className="shop-hero-desc">
          Chaque création est pensée à la main, imprimée avec soin.
        </p>
      </div>

      <div className="shop-categories">
        <Link to="/shop/affiches" className="shop-categorie-card">
          <img src={affichesImg} alt="Affiches" className="shop-categorie-img" />
          <div className="shop-categorie-overlay">
            <div className="shop-categorie-content">
              <span className="shop-categorie-label">Affiches</span>
              <span className="shop-categorie-arrow">Découvrir →</span>
            </div>
          </div>
        </Link>

        <Link to="/shop/cartes" className="shop-categorie-card">
          <img src={cartesImg} alt="Cartes postales" className="shop-categorie-img" />
          <div className="shop-categorie-overlay">
            <div className="shop-categorie-content">
              <span className="shop-categorie-label">Cartes postales</span>
              <span className="shop-categorie-arrow">Découvrir →</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
