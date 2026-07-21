import { Link } from "react-router-dom";
import { cloudinaryUrl } from "../lib/cloudinary";
import "./Shop.css";

const affichesImg = "https://res.cloudinary.com/dgi4qubrq/image/upload/v1782071960/Mockup-44-Nantes-Tourlu_wvbwwf.jpg";
const cartesImg = "https://res.cloudinary.com/dgi4qubrq/image/upload/v1782071958/Mockup_carte_postale_oc9ege.jpg";

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
          <img
            src={cloudinaryUrl(affichesImg, 800)}
            alt="Affiches"
            className="shop-categorie-img"
            loading="lazy"
          />
          <div className="shop-categorie-overlay">
            <div className="shop-categorie-content">
              <span className="shop-categorie-label">Affiches</span>
              <span className="shop-categorie-arrow">Découvrir →</span>
            </div>
          </div>
        </Link>

        <Link to="/shop/cartes" className="shop-categorie-card">
          <img
            src={cloudinaryUrl(cartesImg, 800)}
            alt="Cartes postales"
            className="shop-categorie-img"
            loading="lazy"
          />
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
