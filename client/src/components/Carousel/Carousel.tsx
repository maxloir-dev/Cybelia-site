import { useState, useEffect, useCallback } from "react";
import "./Carousel.css";
import tourLu from "../../assets/photo/photo_banniere/sable_tour_lu_et_pommeraye.webp";

const slides = [
	{ image: tourLu, alt: "Tour Lu et passage sable" },
	{ image: "https://picsum.photos/seed/22/1600/800", alt: "Slide 2" },
	{ image: "https://picsum.photos/seed/33/1600/800", alt: "Slide 3" },
	{ image: "https://picsum.photos/seed/44/1600/800", alt: "Slide 4" },
];

const INTERVAL = 4000;

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
