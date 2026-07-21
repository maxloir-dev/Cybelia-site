import { useState, useEffect, type ReactNode } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./store/CartContext";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Shop from "./pages/Shop";
import Admin from "./pages/Admin/Admin";
import About from "./pages/About";
import Personnalise from "./pages/Personnalise";
import Contact from "./pages/Contact";
import Panier from "./pages/Panier";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import Show from "./components/Show_product/Show";
import ProtectedRoute from "./components/ProtectedRoute";
import Profil from "./pages/Profil/Profil";
import Cgu from "./pages/Cgu";
import "tailwindcss";
import MiniPanier from "./components/MiniPanier/MiniPanier";

function ScrollToTop() {
	const { pathname } = useLocation();
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);
	return null;
}

// Masque la navbar, le mini-panier et le footer pendant le paiement
// pour ne pas distraire le client en plein paiement
function Chrome({
	introPlayed,
	children,
}: {
	introPlayed: boolean;
	children: ReactNode;
}) {
	const { pathname } = useLocation();
	const masquerChrome = pathname === "/checkout";

	return (
		<>
			{introPlayed && !masquerChrome && <Navbar />}
			{!masquerChrome && <MiniPanier />}
			{children}
			{introPlayed && !masquerChrome && <Footer />}
		</>
	);
}

function App() {
	const [introPlayed, setIntroPlayed] = useState(
		() => !!sessionStorage.getItem("introPlayed"),
	);

	return (
		<CartProvider>
			<BrowserRouter>
				<ScrollToTop />
				<Chrome introPlayed={introPlayed}>
					<Routes>
					{/* Routes publiques */}
					<Route
						path="/"
						element={<Home onIntroComplete={() => setIntroPlayed(true)} />}
					/>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/forgot-password" element={<ForgotPassword />} />
					<Route path="/reset-password/:token" element={<ResetPassword />} />
					<Route path="/shop" element={<Shop />} />
					<Route
						path="/shop/cartes"
						element={<Show categorieId={1} titre="Cartes postales" />}
					/>
					<Route
						path="/shop/affiches"
						element={<Show categorieId={2} titre="Affiches" />}
					/>
					<Route path="/about" element={<About />} />
					<Route path="/contact" element={<Contact />} />
					<Route path="/personnalise" element={<Personnalise />} />
					<Route path="/cgu" element={<Cgu />} />

					{/* Routes client connecté */}
					<Route
						path="/panier"
						element={
							<ProtectedRoute>
								<Panier />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/profil"
						element={
							<ProtectedRoute>
								<Profil />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/checkout"
						element={
							<ProtectedRoute>
								<Checkout />
							</ProtectedRoute>
						}
					/>
					<Route path="/success" element={<Success />} />

					{/* Routes gérante uniquement */}
					<Route
						path="/admin"
						element={
							<ProtectedRoute adminSeulement={true}>
								<Admin />
							</ProtectedRoute>
						}
					/>
					</Routes>
				</Chrome>
			</BrowserRouter>
		</CartProvider>
	);
}

export default App;
