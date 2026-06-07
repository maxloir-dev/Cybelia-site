import {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";
import type { ReactNode } from "react";

interface CartItem {
	cartKey: string; // "produitId-dimensionId" ou "produitId-sans"
	id: number;
	nom: string;
	prix: number;
	image_url: string;
	quantite: number;
	dimension_id?: number | null;
	dimension_label?: string | null;
}

interface CartContextType {
	items: CartItem[];
	nombreArticles: number;
	total: number;
	dernierProduitAjoute: Omit<CartItem, "quantite"> | null;
	miniPanierOuvert: boolean;
	ajouterAuPanier: (produit: Omit<CartItem, "quantite">) => void;
	supprimerDuPanier: (cartKey: string) => void;
	modifierQuantite: (cartKey: string, quantite: number) => void;
	viderPanier: () => void;
	fermerMiniPanier: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
	const [items, setItems] = useState<CartItem[]>(() => {
		const saved = localStorage.getItem("panier");
		return saved ? JSON.parse(saved) : [];
	});
	const [miniPanierOuvert, setMiniPanierOuvert] = useState(false);
	const [dernierProduitAjoute, setDernierProduitAjoute] = useState<Omit<
		CartItem,
		"quantite"
	> | null>(null);

	useEffect(() => {
		localStorage.setItem("panier", JSON.stringify(items));
	}, [items]);

	const ajouterAuPanier = (produit: Omit<CartItem, "quantite">) => {
		setItems((prev) => {
			const existant = prev.find((item) => item.cartKey === produit.cartKey);
			if (existant) {
				return prev.map((item) =>
					item.cartKey === produit.cartKey
						? { ...item, quantite: item.quantite + 1 }
						: item,
				);
			}
			return [...prev, { ...produit, quantite: 1 }];
		});
		setDernierProduitAjoute(produit);
		setMiniPanierOuvert(true);
	};

	const supprimerDuPanier = (cartKey: string) => {
		setItems((prev) => prev.filter((item) => item.cartKey !== cartKey));
	};

	const modifierQuantite = (cartKey: string, quantite: number) => {
		if (quantite < 1) return;
		setItems((prev) =>
			prev.map((item) => (item.cartKey === cartKey ? { ...item, quantite } : item)),
		);
	};

	const viderPanier = () => setItems([]);
	const fermerMiniPanier = useCallback(() => setMiniPanierOuvert(false), []);

	const nombreArticles = items.reduce((acc, item) => acc + item.quantite, 0);
	const total = items.reduce((acc, item) => acc + item.prix * item.quantite, 0);

	return (
		<CartContext.Provider
			value={{
				items,
				nombreArticles,
				total,
				dernierProduitAjoute,
				miniPanierOuvert,
				ajouterAuPanier,
				supprimerDuPanier,
				modifierQuantite,
				viderPanier,
				fermerMiniPanier,
			}}
		>
			{children}
		</CartContext.Provider>
	);
};

export const useCart = () => {
	const context = useContext(CartContext);
	if (!context)
		throw new Error("useCart doit être utilisé dans un CartProvider");
	return context;
};
