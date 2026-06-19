import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCart } from "../store/CartContext";
import api from "../api/axios";
import CheckoutForm from "../components/Checkout/CheckoutForm";
import "./Checkout.css";
import { useNavigate } from "react-router-dom";


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function Checkout() {
	const { items, total } = useCart();
	const [clientSecret, setClientSecret] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		api
			.post("/stripe/create-payment-intent", {
				amount: Math.round(total * 100),
			})
			.then(({ data }) => setClientSecret(data.clientSecret));
	}, [total]);

	return (
	<div className="checkout-page">
            <button
                type="button"
                className="checkout-retour"
                onClick={() => navigate("/panier")}
                aria-label="Retour au panier"
            >
                <svg width="36" height="20" viewBox="0 0 36 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="34" y1="10" x2="2" y2="10" />
                    <polyline points="10 18 2 10 10 2" />
                </svg>
            </button>
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
						<Elements
    stripe={stripePromise}
    options={{
        clientSecret,
        appearance: {
            theme: "flat",
            variables: {
                colorPrimary: "#965846",
                colorBackground: "#ffffff",
                colorText: "#111111",
                colorDanger: "#c0392b",
                fontFamily: "Oswald, sans-serif",
                borderRadius: "12px",
            },
        },
    }}
>
    <CheckoutForm />
</Elements>
					)}
				</div>
			</div>
		</div>
	);
}

export default Checkout;
