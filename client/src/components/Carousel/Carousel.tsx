import { useState, useEffect, useCallback } from "react";
import { cloudinaryUrl } from "../../lib/cloudinary";
import "./Carousel.css";
const slides = [
	{ image: "https://res.cloudinary.com/dgi4qubrq/image/upload/v1782071958/Mockup-44-TourLu_orzwhu.jpg", alt: "Mockup Tour Lu" },
	{ image: "https://res.cloudinary.com/dgi4qubrq/image/upload/v1782071960/Mockup-44-Nantes-passagepommeraye_2_zgkyvy.jpg", alt: "Mockup Nantes passage Pommeraye" },
	{ image: "https://res.cloudinary.com/dgi4qubrq/image/upload/v1782071961/Photo_de_moi_a72vwx.jpg", alt: "Photo de moi" },
];

const INTERVAL = 4000;

// Largeurs proposées au navigateur, qui choisit la plus adaptée à l'écran et à
// sa densité de pixels : net sur grand écran, léger sur mobile.
const LARGEURS_IMAGE = [768, 1200, 1600, 2000];

function srcSet(image: string) {
	return LARGEURS_IMAGE.map((largeur) => `${cloudinaryUrl(image, largeur)} ${largeur}w`).join(", ");
}

function Carousel() {
	const [current, setCurrent] = useState(0);
	const [transitioning, setTransitioning] = useState(false);

	const goTo = useCallback(
		(index: number) => {
			if (transitioning) return;
			setTransitioning(true);
			setCurrent(index);
			setTimeout(() => {
				setTransitioning(false);
			}, 2000);
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
			<div className="carousel__track">
				{slides.map((slide, i) => (
					<div
						key={slide.image}
						className={`carousel__slide ${i === current ? "carousel__slide--actif" : ""}`}
					>
						<img
							src={cloudinaryUrl(slide.image, 1200)}
							srcSet={srcSet(slide.image)}
							sizes="100vw"
							alt={slide.alt}
							className="carousel__image"
						/>
					</div>
				))}
			</div>

			<div className="carousel__dots">
				{slides.map((slide, i) => (
					<button
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
