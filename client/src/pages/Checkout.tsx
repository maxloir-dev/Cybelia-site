import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCart } from "../store/CartContext";
import api from "../api/axios";
import CheckoutForm from "../components/Checkout/CheckoutForm";
import "./Checkout.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function Checkout() {
	const { items, total } = useCart();
	const [clientSecret, setClientSecret] = useState("");

	useEffect(() => {
		api
			.post("/stripe/create-payment-intent", {
				amount: Math.round(total * 100),
			})
			.then(({ data }) => setClientSecret(data.clientSecret));
	}, [total]);

	return (
		<div className="checkout-page">
			<h1 className="checkout-titre">Paiement</h1>

			<div className="checkout-layout">
				{/* Colonne gauche — récapitulatif */}
				<div className="checkout-recap">
					<h2 className="checkout-recap__titre">Récapitulatif</h2>
					<div className="checkout-recap__liste">
						{items.map((item) => (
							<div key={item.cartKey} className="checkout-recap__item">
								<span className="checkout-recap__nom">
									{item.quantite}x {item.nom}
									{item.dimension_label && ` — ${item.dimension_label}`}
								</span>
								<span>{(item.prix * item.quantite).toFixed(2)} €</span>
							</div>
						))}
					</div>
					<div className="checkout-recap__total">
						<span>Total</span>
						<span>{total.toFixed(2)} €</span>
					</div>
				</div>

				{/* Colonne droite — paiement */}
				<div className="checkout-carte">
					{!clientSecret ? (
						<p className="checkout-chargement">Chargement...</p>
					) : (
						<Elements stripe={stripePromise} options={{ clientSecret }}>
							<CheckoutForm />
						</Elements>
					)}
				</div>
			</div>
		</div>
	);
}

export default Checkout;
