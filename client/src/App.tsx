import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Shop from "./pages/Shop";
import Admin from "./pages/Admin";
import About from "./pages/About";
import Navbar from "./components/Navbar/Navbar";
import Personnalise from "./pages/Personnalise";
import Contact from "./pages/Contact";
import Panier from "./pages/Panier";
import { useState } from "react";
import Footer from "./components/Footer/Footer";

function App() {
	const [introPlayed, setIntroPlayed] = useState(
		() => !!sessionStorage.getItem("introPlayed"),
	);
	return (
		<BrowserRouter>
			{introPlayed && <Navbar />}
			<Routes>
				<Route
					path="/"
					element={<Home onIntroComplete={() => setIntroPlayed(true)} />}
				/>
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/shop" element={<Shop />} />
				<Route path="/admin" element={<Admin />} />
				<Route path="/about" element={<About />} />
				<Route path="/personnalise" element={<Personnalise />} />
				<Route path="/contact" element={<Contact />} />
				<Route path="/panier" element={<Panier />} />
			</Routes>
			{introPlayed && <Footer />}
		</BrowserRouter>
	);
}

export default App;
