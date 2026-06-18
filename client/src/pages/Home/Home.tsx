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
import aproposImg from "../../assets/photo/DSC00121.jpg";

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
							<p>
								Découvrez régulièrement de nouvelles illustrations inspirées de
								villes, lieux emblématiques et architectures du monde entier.
								Chaque création réalisée à la main vient enrichir la collection
								pour faire voyager votre intérieur au fil des découvertes.
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
					<div className="nouveautes-btn">
						<p className="nouveautes-btn-text">
							Explorez une collection d'affiches de villes dessinées avec
							authenticité, inspirées de lieux emblématiques et conçues pour
							apporter caractère et évasion à votre décoration.
						</p>
						<a href="/shop" className="custom-button">
							<span className="button-text">Voir la collection</span>
						</a>
					</div>
				</div>

				{/* Section Pour qui */}
				<div className="home-pourqui-section">
					<p className="perso-section-sub">Nos créations</p>
					<h2 className="perso-section-titre">
						Nos créations s'adressent à vous
					</h2>
					<div className="perso-pourqui-grid">
						<div className="perso-pourqui-item">
							<svg
								width="32"
								height="32"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.2"
								aria-hidden="true"
							>
								<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
								<polyline points="9 22 9 12 15 12 15 22" />
							</svg>
							<span>Particuliers</span>
						</div>
						<div className="perso-pourqui-item">
							<svg
								width="32"
								height="32"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.2"
								aria-hidden="true"
							>
								<rect x="2" y="3" width="20" height="14" rx="2" />
								<path d="M8 21h8M12 17v4" />
							</svg>
							<span>Entreprises</span>
						</div>
						<div className="perso-pourqui-item">
							<svg
								width="32"
								height="32"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.2"
								aria-hidden="true"
							>
								<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
							</svg>
							<span>Cadeaux</span>
						</div>
						<div className="perso-pourqui-item">
							<svg
								width="32"
								height="32"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.2"
								aria-hidden="true"
							>
								<path d="M12 2L2 7l10 5 10-5-10-5z" />
								<path d="M2 17l10 5 10-5" />
								<path d="M2 12l10 5 10-5" />
							</svg>
							<span>Événements</span>
						</div>
					</div>
				</div>

				{/* Section Personnalisée */}
				<div className="home-perso-section">
					<div className="home-perso-content">
						<p className="home-perso-sub">Sur mesure</p>
						<h2 className="home-perso-titre">
							Une création rien que pour vous
						</h2>
						<p className="home-perso-texte">
							Maison de famille, lieu de voyage ou souvenir précieux : chaque
							photo peut devenir une affiche personnalisée unique et pleine
							d'émotion.
						</p>
						<a href="/personnalise" className="custom-button">
							<span className="button-text">Découvrir</span>
						</a>
					</div>
				</div>

				{/* Section À propos */}
				<div className="home-apropos-section">
					<div className="home-apropos-inner">
						<div className="home-apropos-image-wrapper">
							<img
								src={aproposImg}
								alt="Cybélia Charrier, illustratrice"
								className="home-apropos-image"
							/>
						</div>
						<div className="home-apropos-content">
							<p className="home-apropos-sub">À propos</p>
							<h2 className="home-apropos-titre">Cybele Architecture</h2>
							<p className="home-apropos-texte">
								Née de la rencontre entre l'art et l'architecture, Cybele
								Architecture mêle création artistique, valorisation du
								patrimoine et architecture d'intérieur. Guidée par une
								sensibilité profonde pour les lieux et leur histoire, chaque
								projet devient une façon de révéler ce qui rend un espace
								unique.
							</p>
							<p className="home-apropos-texte">
								À travers des illustrations à l'aquarelle, je mets en lumière
								les architectures et paysages qui façonnent nos territoires —
								parce que chaque création raconte une histoire et célèbre le
								lien entre patrimoine, art et habitat.
							</p>
							<p className="home-apropos-citation">
								« Le nom Cybele trouve son origine dans Cybèle, déesse de la
								nature et protectrice des lieux dans la mythologie grecque — un
								symbole qui reflète ma volonté de révéler la beauté et
								l'identité des espaces à travers chacun de mes projets. »
							</p>
							<a href="/about" className="custom-button home-apropos-btn">
								<span className="button-text">En savoir plus</span>
							</a>
						</div>
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
