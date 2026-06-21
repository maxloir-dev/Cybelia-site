import { useState, useEffect, useCallback } from "react";
import "./Carousel.css";
const slides = [
	{ image: "https://res.cloudinary.com/dgi4qubrq/image/upload/v1782071960/Tour_lu_et_passage_sable__zlzngc.jpg", alt: "Tour Lu et passage sable" },
	{ image: "https://res.cloudinary.com/dgi4qubrq/image/upload/v1782071958/Mockup-44-TourLu_orzwhu.jpg", alt: "Mockup Tour Lu" },
	{ image: "https://res.cloudinary.com/dgi4qubrq/image/upload/v1782071960/Mockup-44-Nantes-passagepommeraye_2_zgkyvy.jpg", alt: "Mockup Nantes passage Pommeraye" },
	{ image: "https://res.cloudinary.com/dgi4qubrq/image/upload/v1782071961/Photo_de_moi_a72vwx.jpg", alt: "Photo de moi" },
];

const INTERVAL = 5000;

function Carousel() {
	const [current, setCurrent] = useState(0);
	const [transitioning, setTransitioning] = useState(false);

	// useCallback permet de stabiliser la fonction pour le useEffect
	const goTo = useCallback(
		(index: number) => {
			if (transitioning) return;
			setTransitioning(true);
			setCurrent(index);
			// On réduit le timeout ou on gère la fin de transition via CSS
			setTimeout(() => {
				setTransitioning(false);
			}, 600);
		},
		[transitioning],
	);

	const next = useCallback(() => {
		goTo((current + 1) % slides.length);
	}, [current, goTo]);

	useEffect(() => {
		const timer = setInterval(next, INTERVAL);
		return () => clearInterval(timer);
	}, [next]);

	return (
		<div className="carousel">
			<div
				className="carousel__track"
				style={{ transform: `translateX(-${current * 100}%)` }}
			>
				{slides.map((slide) => (
					<div key={slide.image} className="carousel__slide">
						{" "}
						<img
							src={slide.image}
							alt={slide.alt}
							className="carousel__image"
						/>
					</div>
				))}
			</div>

			<div className="carousel__dots">
				{slides.map((slide, i) => (
					<button
						// On utilise slide.image (unique) au lieu de l'index i
						key={`dot-${slide.image}`}
						type="button"
						className={`carousel__dot ${i === current ? "carousel__dot--actif" : ""}`}
						onClick={() => goTo(i)}
						aria-label={`Aller à la slide ${i + 1}`}
					>
						<span className="sr-only" style={{ display: "none" }}>
							{i + 1}
						</span>
					</button>
				))}
			</div>
		</div>
	);
}

export default Carousel;
