import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import Show from "./components/Show_product/Show";
import ProtectedRoute from "./components/ProtectedRoute";
import Profil from "./pages/Profil/Profil";

function App() {
	const [introPlayed, setIntroPlayed] = useState(
		() => !!sessionStorage.getItem("introPlayed"),
	);

	return (
		<CartProvider>
			<BrowserRouter>
				{introPlayed && <Navbar />}
				<Routes>
					{/* Routes publiques */}
					<Route
						path="/"
						element={<Home onIntroComplete={() => setIntroPlayed(true)} />}
					/>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
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
				{introPlayed && <Footer />}
			</BrowserRouter>
		</CartProvider>
	);
}

export default App;
