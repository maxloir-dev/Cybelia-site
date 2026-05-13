"use client";
import { useEffect, useState } from "react";
import SplitText from "../../components/SplitText";
import "./Home.css";
import Hero from "../../components/Hero/Hero";
import Features from "../../components/Features/Features";
import CircularGallery from "../../components/CircularGallery/CircularGallery";
import { getProduits } from "../../api/produitService";
import type { Produit } from "../../types";
import Carousel from "../../components/Carousel/Carousel";

interface HomeProps {
	onIntroComplete: () => void;
}

function Home({ onIntroComplete }: HomeProps) {
	const [stage, setStage] = useState<"intro" | "exiting" | "content">(() => {
		return sessionStorage.getItem("introPlayed") ? "content" : "intro";
	});
	const [galerie, setGalerie] = useState<{ image: string; text: string }[]>([]);

	// Récupère les derniers produits pour la galerie
	useEffect(() => {
		const chargerProduits = async () => {
			const produits: Produit[] = await getProduits();
			// On prend les 8 derniers produits ajoutés
			const derniersProduits = produits
				.slice(-8)
				.reverse()
				.map((p) => ({
					image: p.image_url,
					text: p.nom,
				}))
				.filter((p) => p.image); // On exclut les produits sans image
			setGalerie(derniersProduits);
		};
		chargerProduits();
	}, []);

	useEffect(() => {
		if (stage === "content") return;
		const timer = setTimeout(() => {
			sessionStorage.setItem("introPlayed", "true");
			setStage("exiting");
		}, 3000);
		return () => clearTimeout(timer);
	}, [stage]);

	if (stage === "content") {
		onIntroComplete();
		return (
			<main className="home-sections">
				{/* Conteneur groupé pour la superposition */}
				<div
					className="hero-container"
					style={{ position: "relative", width: "100%" }}
				>
					<Carousel />
					<Hero />
				</div>
				<div className="features-container">
					<Features />
				</div>
				<div className="section">
					<div className="nouveautes-header">
						<h2 className="nouveautes-title">Nouveautés</h2>
						<div className="nouveautes-text">
							<p className="nouveautes-subtitle">Vous aimez notre style ?</p>
							<p>
								Chaque semaine, Cybelia dévoile de nouvelles créations inspirées
								de ses projets. Découvrez ses dernières œuvres et laissez-vous
								emporter par son univers.
							</p>
						</div>
					</div>
					<div className="gallery-wrapper">
						<CircularGallery
							items={galerie.length > 0 ? galerie : undefined}
							bend={0}
							textColor="#965846"
							borderRadius={0.1}
							scrollSpeed={2}
							scrollEase={0.05}
						/>
					</div>
				</div>
			</main>
		);
	}

	return (
		<div
			style={{
				position: "fixed",
				inset: 0,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				color: "var(--color-text)",
				zIndex: 50,
			}}
		>
			<SplitText
				text="BIENVENUE"
				className="intro-text"
				delay={80}
				duration={1.5}
				animateOut={stage === "exiting"}
				onExitComplete={() => setStage("content")}
			/>
		</div>
	);
}

export default Home;
