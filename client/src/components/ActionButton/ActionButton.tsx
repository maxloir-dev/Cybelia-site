import "./ActionButton.css";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface ActionButtonProps {
	children: ReactNode;
	to?: string; // Si 'to' est présent, on utilise Link
	onClick?: () => void;
	type?: "button" | "submit" | "reset";
	className?: string;
	inverse?: boolean;
	disabled?: boolean;
}

const ActionButton = ({
	children,
	to,
	onClick,
	type = "button",
	className = "",
	inverse = false,
}: ActionButtonProps) => {
	const content = <span className="button-text">{children}</span>;
	const classes = `custom-button ${inverse ? "custom-button--inverse" : ""} ${className}`;

	// Si une destination est fournie, on utilise Link de react-router
	if (to) {
		return (
			<Link to={to} className={classes}>
				{content}
			</Link>
		);
	}

	return (
		<button className={classes} onClick={onClick} type={type}>
			{content}
		</button>
	);
};

export default ActionButton;
