"use client";
import { useEffect, useState } from "react";
import SplitText from "../../components/SplitText";
import "./Home.css";
import Hero from "../../components/Hero/Hero";
import Features from "../../components/Features/Features";
import RevealCard from "../../components/RevealCard";
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
				.filter((p) => p.image_url)
				.map((p) => ({
					image: p.image_url!,
					text: p.nom,
				}));
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
					<RevealCard direction="left">
						<Features />
					</RevealCard>
				</div>
				<div className="section">
					<RevealCard direction="left">
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
					</RevealCard>
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
					<RevealCard direction="right">
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
					</RevealCard>
				</div>

				{/* Section Pour qui */}
				<div className="home-pourqui-section">
					<p className="perso-section-sub">Nos créations</p>
					<h2 className="perso-section-titre">
						Nos créations s'adressent à vous
					</h2>
					<div className="perso-pourqui-grid">
						<RevealCard direction="left" delay={0}>
							<div className="perso-pourqui-item">
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden="true"
									focusable="false"
								>
									<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
									<polyline points="9 22 9 12 15 12 15 22" />
								</svg>
								<span>Particuliers</span>
							</div>
						</RevealCard>
						<RevealCard direction="right" delay={0.08}>
							<div className="perso-pourqui-item">
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden="true"
									focusable="false"
								>
									<rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
									<line x1="9" y1="22" x2="9" y2="16" />
									<line x1="15" y1="22" x2="15" y2="16" />
									<line x1="9" y1="16" x2="15" y2="16" />
									<path d="M8 6h.01M16 6h.01M8 11h.01M16 11h.01" />
								</svg>
								<span>Entreprises</span>
							</div>
						</RevealCard>
						<RevealCard direction="left" delay={0.16}>
							<div className="perso-pourqui-item">
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden="true"
									focusable="false"
								>
									<polyline points="20 12 20 22 4 22 4 12" />
									<rect x="2" y="7" width="20" height="5" />
									<line x1="12" y1="22" x2="12" y2="7" />
									<path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
									<path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
								</svg>
								<span>Cadeaux</span>
							</div>
						</RevealCard>
						<RevealCard direction="right" delay={0.24}>
							<div className="perso-pourqui-item">
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden="true"
									focusable="false"
								>
									<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
									<path
										d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5z"
										opacity="0.5"
									/>
									<path
										d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z"
										opacity="0.5"
									/>
								</svg>
								<span>Événements</span>
							</div>
						</RevealCard>
					</div>
				</div>

				{/* Section Personnalisée */}
				<div className="home-perso-section">
					<RevealCard direction="right">
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
					</RevealCard>
				</div>

				{/* Section À propos */}
				<div className="home-apropos-section">
					<div className="home-apropos-inner">
						<RevealCard direction="left" className="home-apropos-image-reveal">
							<div className="home-apropos-image-wrapper">
								<img
									src={aproposImg}
									alt="Cybélia Charrier, illustratrice"
									className="home-apropos-image"
								/>
							</div>
						</RevealCard>
						<RevealCard direction="right" delay={0.1} className="home-apropos-content-reveal">
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
						</RevealCard>
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
