import HTMLFlipBook from "react-pageflip";
import "./BookPortfolio.css";
import { forwardRef } from "react";

interface Project {
	id: number;
	title: string;
	description: string;
	images: string[];
}

const projects: Project[] = [
	{
		id: 1,
		title: "Appartement Haussmannien",
		description:
			"Rénovation complète d'un appartement parisien de 120m². Mélange de modernité et de cachet ancien.",
		images: ["/projects/project1.jpg"],
	},
	{
		id: 2,
		title: "Loft Industriel",
		description:
			"Transformation d'un ancien entrepôt en loft contemporain. Matériaux bruts et lumière naturelle.",
		images: ["/projects/project2.jpg"],
	},
];

const PageCover = forwardRef<HTMLDivElement, { title: string }>(
	({ title }, ref) => (
		<div className="page page-cover" ref={ref}>
			<h1>{title}</h1>
		</div>
	),
);

const PageContent = forwardRef<HTMLDivElement, { project: Project }>(
	({ project }, ref) => (
		<div className="page page-content" ref={ref}>
			<div className="page-image-wrapper">
				<img src={project.images[0]} alt={project.title} />
			</div>
			<div className="page-text">
				<h2>{project.title}</h2>
				<p>{project.description}</p>
			</div>
		</div>
	),
);

function BookPortfolio() {
	return (
		<div className="book-wrapper">
			<HTMLFlipBook
				width={380}
				height={560}
				size="fixed"
				minWidth={300}
				maxWidth={500}
				minHeight={400}
				maxHeight={700}
				showCover={true}
				mobileScrollSupport={false}
				className="book"
				style={{}}
				startPage={0}
				drawShadow={true}
				flippingTime={800}
				usePortrait={false}
				startZIndex={0}
				autoSize={false}
				clickEventForward={true}
				useMouseEvents={true}
				swipeDistance={30}
				showPageCorners={true}
				disableFlipByClick={false}
				maxShadowOpacity={0.5}
			>
				<PageCover title="Book — Cybelia" />
				<PageContent project={projects[0]} />
				<PageContent project={projects[1]} />
				<PageCover title="Merci" />
			</HTMLFlipBook>
		</div>
	);
}

export default BookPortfolio;
