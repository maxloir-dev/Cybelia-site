import { useState, useEffect, useCallback } from "react";
import "./Carousel.css";

const slides = [
	{ image: "https://picsum.photos/seed/11/1600/800", alt: "Slide 1" },
	{ image: "https://picsum.photos/seed/22/1600/800", alt: "Slide 2" },
	{ image: "https://picsum.photos/seed/33/1600/800", alt: "Slide 3" },
	{ image: "https://picsum.photos/seed/44/1600/800", alt: "Slide 4" },
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
