import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface CartItem {
	id: number;
	nom: string;
	prix: number;
	image_url: string;
	quantite: number;
}

interface CartContextType {
	items: CartItem[];
	nombreArticles: number;
	total: number;
	ajouterAuPanier: (produit: Omit<CartItem, "quantite">) => void;
	supprimerDuPanier: (id: number) => void;
	modifierQuantite: (id: number, quantite: number) => void;
	viderPanier: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
	const [items, setItems] = useState<CartItem[]>(() => {
		const saved = localStorage.getItem("panier");
		return saved ? JSON.parse(saved) : [];
	});

	useEffect(() => {
		localStorage.setItem("panier", JSON.stringify(items));
	}, [items]);

	const ajouterAuPanier = (produit: Omit<CartItem, "quantite">) => {
		setItems((prev) => {
			const existant = prev.find((item) => item.id === produit.id);
			if (existant) {
				return prev.map((item) =>
					item.id === produit.id
						? { ...item, quantite: item.quantite + 1 }
						: item,
				);
			}
			return [...prev, { ...produit, quantite: 1 }];
		});
	};

	const supprimerDuPanier = (id: number) => {
		setItems((prev) => prev.filter((item) => item.id !== id));
	};

	const modifierQuantite = (id: number, quantite: number) => {
		if (quantite < 1) return;
		setItems((prev) =>
			prev.map((item) => (item.id === id ? { ...item, quantite } : item)),
		);
	};

	const viderPanier = () => setItems([]);

	const nombreArticles = items.reduce((acc, item) => acc + item.quantite, 0);
	const total = items.reduce((acc, item) => acc + item.prix * item.quantite, 0);

	return (
		<CartContext.Provider
			value={{
				items,
				nombreArticles,
				total,
				ajouterAuPanier,
				supprimerDuPanier,
				modifierQuantite,
				viderPanier,
			}}
		>
			{children}
		</CartContext.Provider>
	);
};

export const useCart = () => {
	const context = useContext(CartContext);
	if (!context) throw new Error("useCart doit être utilisé dans un CartProvider");
	return context;
};
