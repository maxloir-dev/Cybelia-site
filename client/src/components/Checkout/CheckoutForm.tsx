import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCart } from "../../store/CartContext";
import { passerCommande } from "../../api/commandeService";
import "./CheckoutForm.css";

function CheckoutForm() {
	const stripe = useStripe();
	const elements = useElements();
	const { items, viderPanier } = useCart();
	const navigate = useNavigate();
	const [chargement, setChargement] = useState(false);
	const [erreur, setErreur] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!stripe || !elements) return;

		setChargement(true);
		setErreur("");

		const { error, paymentIntent } = await stripe.confirmPayment({
			elements,
			redirect: "if_required",
		});

		if (error) {
			setErreur(error.message ?? "Le paiement a échoué.");
			setChargement(false);
			return;
		}

		if (paymentIntent?.status === "succeeded") {
			const lignes = items.map((item) => ({
				produit_id: item.id,
				quantite: item.quantite,
				prix_unitaire: item.prix,
				dimension_id: item.dimension_id ?? null,
			}));

			await passerCommande(lignes);
			viderPanier();
			navigate("/success");
		}
	};

	return (
		<form className="checkout-form" onSubmit={handleSubmit}>
			<PaymentElement />
			{erreur && <p className="checkout-erreur">{erreur}</p>}
			<button className="checkout-bouton" type="submit" disabled={!stripe || chargement}>
				{chargement ? "Paiement en cours..." : "Payer"}
			</button>
		</form>
	);
}

export default CheckoutForm;
