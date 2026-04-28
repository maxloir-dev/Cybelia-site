import { useState } from "react";
import "./Contact.css";

type Form = {
  nom: string;
  email: string;
  sujet: string;
  message: string;
};

const formVide: Form = { nom: "", email: "", sujet: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState<Form>(formVide);
  const [erreurs, setErreurs] = useState<Partial<Form>>({});
  const [envoye, setEnvoye] = useState(false);

  const valider = (f: Form) => {
    const e: Partial<Form> = {};
    if (!f.nom.trim())     e.nom = "Le nom est obligatoire";
    if (!f.email.trim())   e.email = "L'email est obligatoire";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Email invalide";
    if (!f.sujet.trim())   e.sujet = "Le sujet est obligatoire";
    if (!f.message.trim()) e.message = "Le message est obligatoire";
    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErreurs({ ...erreurs, [e.target.name]: undefined });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const e_ = valider(form);
    if (Object.keys(e_).length > 0) { setErreurs(e_); return; }
    await fetch("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setEnvoye(true);
    setForm(formVide);
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1 className="contact-titre">Contact</h1>
        <p className="contact-sous-titre">Une question ? N'hésitez pas à nous écrire.</p>
        <p className="contact-sous-titre">Je mets un point d'honneur à répondre rapidement à chaque message, vous reçeverez une réponse très bientôt</p>
      </div>

      <div className="contact-contenu">
        {envoye ? (
          <div className="contact-succes">
            <p>Merci pour votre message, nous vous répondrons rapidement.</p>
            <button onClick={() => setEnvoye(false)}>Envoyer un autre message</button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form-ligne">
              <div className="contact-form-champ">
                <label>Nom *</label>
                <input name="nom" placeholder="Votre nom" value={form.nom} onChange={handleChange} />
                {erreurs.nom && <span className="contact-erreur">{erreurs.nom}</span>}
              </div>
              <div className="contact-form-champ">
                <label>Email *</label>
                <input name="email" placeholder="Votre email" value={form.email} onChange={handleChange} />
                {erreurs.email && <span className="contact-erreur">{erreurs.email}</span>}
              </div>
            </div>
            <div className="contact-form-champ">
              <label>Sujet *</label>
              <input name="sujet" placeholder="Sujet de votre message" value={form.sujet} onChange={handleChange} />
              {erreurs.sujet && <span className="contact-erreur">{erreurs.sujet}</span>}
            </div>
            <div className="contact-form-champ">
              <label>Message *</label>
              <textarea name="message" placeholder="Votre message..." rows={6} value={form.message} onChange={handleChange} />
              {erreurs.message && <span className="contact-erreur">{erreurs.message}</span>}
            </div>
            <button type="submit" className="contact-btn">Envoyer</button>
          </form>
        )}

        <div className="contact-infos">
          <h2>Cybelia</h2>
          <p>Pour toute demande concernant une commande, une personnalisation ou un renseignement général.</p>
          <p className="contact-email">cybele.architecture@gmail.com</p>
        </div>
      </div>
    </div>
  );
}
