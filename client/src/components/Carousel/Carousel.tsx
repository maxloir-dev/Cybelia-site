import { useState, useEffect } from "react";
import "./Carousel.css";

// ============================================
// Images du carousel — à remplacer par les
// photos envoyées par la cliente
// ============================================
const slides = [
	{
		image: "https://picsum.photos/seed/11/1600/800",
		alt: "Slide 1",
	},
	{
		image: "https://picsum.photos/seed/22/1600/800",
		alt: "Slide 2",
	},
	{
		image: "https://picsum.photos/seed/33/1600/800",
		alt: "Slide 3",
	},
	{
		image: "https://picsum.photos/seed/44/1600/800",
		alt: "Slide 4",
	},
];

const INTERVAL = 5000; // 5 secondes entre chaque slide

function Carousel() {
	const [current, setCurrent] = useState(0);
	const [transitioning, setTransitioning] = useState(false);

	const goTo = (index: number) => {
		if (transitioning) return;
		setTransitioning(true);
		setTimeout(() => {
			setCurrent(index);
			setTransitioning(false);
		}, 600);
	};

	const next = () => goTo((current + 1) % slides.length);

	// Défilement automatique
	useEffect(() => {
		const timer = setInterval(next, INTERVAL);
		return () => clearInterval(timer);
	}, [current, transitioning]);

	return (
		<div className="carousel">
			{/* Slides */}
			<div
				className="carousel__track"
				style={{ transform: `translateX(-${current * 100}%)` }}
			>
				{slides.map((slide, i) => (
					<div key={i} className="carousel__slide">
						<img
							src={slide.image}
							alt={slide.alt}
							className="carousel__image"
						/>
					</div>
				))}
			</div>

			{/* Points de navigation */}
			<div className="carousel__dots">
				{slides.map((_, i) => (
					<button
						key={i}
						className={`carousel__dot ${i === current ? "carousel__dot--actif" : ""}`}
						onClick={() => goTo(i)}
						aria-label={`Slide ${i + 1}`}
					/>
				))}
			</div>
		</div>
	);
}

export default Carousel;
