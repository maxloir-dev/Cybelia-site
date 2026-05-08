import "./ActionButton.css";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface ActionButtonProps {
	children: ReactNode;
	to?: string; // Si 'to' est présent, on utilise Link
	onClick?: () => void;
	type?: "button" | "submit" | "reset";
	className?: string;
}

const ActionButton = ({
	children,
	to,
	onClick,
	type = "button",
	className = "",
}: ActionButtonProps) => {
	const content = <span className="button-text">{children}</span>;

	// Si une destination est fournie, on utilise Link de react-router
	if (to) {
		return (
			<Link to={to} className={`custom-button ${className}`}>
				{content}
			</Link>
		);
	}

	// Sinon on utilise un bouton classique
	return (
		<button
			className={`custom-button ${className}`}
			onClick={onClick}
			type={type}
		>
			{content}
		</button>
	);
};

export default ActionButton;
