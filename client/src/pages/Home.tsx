"use client";
import { useState, useEffect } from "react";
import SplitText from "../components/SplitText";
import "./Home.css";

interface HomeProps {
	onIntroComplete: () => void;
}

function Home({ onIntroComplete }: HomeProps) {
	const [stage, setStage] = useState<"intro" | "exiting" | "content">(() => {
		return sessionStorage.getItem("introPlayed") ? "content" : "intro";
	});

	useEffect(() => {
		if (stage === "content") return;

		const timer = setTimeout(() => {
			sessionStorage.setItem("introPlayed", "true");
			setStage("exiting");
		}, 3000);

		return () => clearTimeout(timer);
	}, []);

	if (stage === "content") {
		onIntroComplete();
		return (
			<main>
				<h1>Ma Page Home est ici !</h1>
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
