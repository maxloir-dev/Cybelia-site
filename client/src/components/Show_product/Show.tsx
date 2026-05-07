import { useEffect, useState } from "react";
import "./show.css"

type Produit = {
  id: number;
  nom: string;
  description: string;
  prix: number;
  image_url: string;
};

type Form = {
  nom: string;
  description: string;
  prix: string;
  categorie_id: number;
};

const formVide: Form = {
  nom: "",
  description: "",
  prix: "",
  categorie_id: 1,
};

type Props = {
  categorieId: number;
  titre: string;
};

export default function Show({ categorieId, titre }: Props) {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [form, setForm] = useState<Form>({ ...formVide, categorie_id: categorieId });
  const [modalOuverte, setModalOuverte] = useState(false);
  const [produitEnEdition, setProduitEnEdition] = useState<Produit | null>(null);
  const [formEdition, setFormEdition] = useState<Form>({ ...formVide, categorie_id: categorieId });
  const [erreurs, setErreurs] = useState<Partial<Form>>({});
  const [erreursEdition, setErreursEdition] = useState<Partial<Form>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileEdition, setImageFileEdition] = useState<File | null>(null);
  const [produitDetail, setProduitDetail] = useState<Produit | null>(null);
  const [recherche, setRecherche] = useState("");
  const fetchProduits = () => {
    fetch(`http://localhost:3000/api/produits?categorie_id=${categorieId}`)
      .then((res) => res.json())
      .then((data) => setProduits(data));
  };

  useEffect(() => {
    fetchProduits();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorieId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const valider = (f: Form) => {
  const e: Partial<Form> = {};

  if (!f.nom.trim()) {
    e.nom = "Le nom est obligatoire";
  }

  if (!f.prix.trim()) {
    e.prix = "Le prix est obligatoire";
  } else if (isNaN(Number(f.prix)) || Number(f.prix) < 0) {
    e.prix = "Le prix doit être un nombre positif";
  }

  return e;
};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const e_ = valider(form);
    if (Object.keys(e_).length > 0) { setErreurs(e_); return; }
    setErreurs({});

    const uploadEtCreer = async () => {
      let image_url = "";
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const res = await fetch("http://localhost:3000/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        image_url = data.url;
      }
      await fetch("http://localhost:3000/api/produits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, prix: Number(form.prix), image_url }),
      });
      setForm({ ...formVide, categorie_id: categorieId });
      setImageFile(null);
      setModalOuverte(false);
      fetchProduits();
    };

    uploadEtCreer();
  };

  const ouvrirEdition = (p: Produit) => {
    setProduitEnEdition(p);
    setFormEdition({
      nom: p.nom,
      description: p.description,
      prix: String(p.prix),
      categorie_id: categorieId,
    });
  };

  const handleChangeEdition = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormEdition({ ...formEdition, [e.target.name]: e.target.value });
  };

  const handleEdition = (e: React.FormEvent) => {
    e.preventDefault();
    const e_ = valider(formEdition);
    if (Object.keys(e_).length > 0) { setErreursEdition(e_); return; }
    setErreursEdition({});

    const uploadEtModifier = async () => {
      let image_url = produitEnEdition!.image_url;
      if (imageFileEdition) {
        const formData = new FormData();
        formData.append("image", imageFileEdition);
        const res = await fetch("http://localhost:3000/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        image_url = data.url;
      }
      await fetch(`http://localhost:3000/api/produits/${produitEnEdition!.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formEdition, prix: Number(formEdition.prix), image_url }),
      });
      setProduitEnEdition(null);
      setImageFileEdition(null);
      fetchProduits();
    };

    uploadEtModifier();
  };

  const handleDelete = (id: number) => {
    fetch(`http://localhost:3000/api/produits/${id}`, { method: "DELETE" })
      .then(() => fetchProduits());
  };

  const produitsFiltres = produits.filter((p) =>
    p.nom.toLowerCase().includes(recherche.toLowerCase()) ||
    p.description.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
      <div className="shop-page">
        <div className="shop-top">
          <h1 className="shop-title">{titre}</h1>
          <input
            className="shop-recherche"
            type="text"
            placeholder=" Rechercher..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}/>
        </div>
      <p className="shop-count">{produitsFiltres.length} résultats affichés</p>

      <div className="shop-grid">
        {produitsFiltres.map((p) => (
          <div key={p.id} className="shop-card" onClick={() => setProduitDetail(p)}>
            <img src={p.image_url} alt={p.nom} className="shop-card-img" />
            <h3 className="shop-card-nom">{p.nom}</h3>
            <p className="shop-card-prix">{p.prix} €</p>
            <button className="shop-card-btn">Ajouter au panier</button>
            <div className="shop-card-actions">
              <button className="shop-card-edit" onClick={(e) => { e.stopPropagation(); ouvrirEdition(p); }}>Modifier</button>
              <button className="shop-card-delete" onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>

      <button className="btn-ouvrir-modal" onClick={() => setModalOuverte(true)}>+</button>

      {modalOuverte && (
        <div className="modal-overlay" onClick={() => setModalOuverte(false)}>
          <div className="modal-contenu" onClick={(e) => e.stopPropagation()}>
            <button className="modal-fermer" onClick={() => setModalOuverte(false)}>✕</button>
            <h2 className="form-title">Ajouter : {titre}</h2>
            <form className="shop-form" onSubmit={handleSubmit}>
              <div>
                <input name="nom" placeholder="Nom *" value={form.nom} onChange={handleChange} />
                {erreurs.nom && <span className="form-erreur">{erreurs.nom}</span>}
              </div>
              <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
              <div>
                <input name="prix" placeholder="Prix *" value={form.prix} onChange={handleChange} />
                {erreurs.prix && <span className="form-erreur">{erreurs.prix}</span>}
              </div>
              <div>
                  <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
              </div>
              <button type="submit">Ajouter</button>
            </form>
          </div>
        </div>
      )}

      {produitEnEdition && (
        <div className="modal-overlay" onClick={() => setProduitEnEdition(null)}>
          <div className="modal-contenu" onClick={(e) => e.stopPropagation()}>
            <button className="modal-fermer" onClick={() => setProduitEnEdition(null)}>✕</button>
            <h2 className="form-title">Modifier : {produitEnEdition.nom}</h2>
            <form className="shop-form" onSubmit={handleEdition}>
              <div>
                <input name="nom" placeholder="Nom *" value={formEdition.nom} onChange={handleChangeEdition} />
                {erreursEdition.nom && <span className="form-erreur">{erreursEdition.nom}</span>}
              </div>
              <textarea name="description" placeholder="Description" value={formEdition.description} onChange={handleChangeEdition} />
              <div>
                <input name="prix" placeholder="Prix *" value={formEdition.prix} onChange={handleChangeEdition} />
                {erreursEdition.prix && <span className="form-erreur">{erreursEdition.prix}</span>}
              </div>
              <div>
                <input type="file" accept="image/*" onChange={(e) => setImageFileEdition(e.target.files?.[0] || null)} />
              </div>
              <button type="submit">Enregistrer</button>
            </form>
          </div>
        </div>
      )}
      {produitDetail && (
        <div className="modal-overlay" onClick={() => setProduitDetail(null)}>
          <div className="modal-detail" onClick={(e) => e.stopPropagation()}>
            <button className="modal-fermer" onClick={() => setProduitDetail(null)}>✕</button>
            <div className="detail-contenu">
              <div className="detail-image">
                <img src={produitDetail.image_url} alt={produitDetail.nom} />
              </div>
              <div className="detail-info">
                <h2>{produitDetail.nom}</h2>
                <p className="detail-prix">{produitDetail.prix} €</p>
                <p className="detail-description">{produitDetail.description}</p>
                <button className="btn-panier">Ajouter au panier</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
