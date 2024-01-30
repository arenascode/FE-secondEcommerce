import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.tsx";
const HeroHome = () => {

  const { setCategory } = useCart()
  
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage:
          "url(/HeroBG.jpg)",
      }}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-white">
        <div className="max-w-md">
          <h1 className="mb-8 text-5xl font-bold">Welcome To Luxury Motorcycles</h1>
          <p className="mb-10 text-lg lg:text-xl lg:tracking-wider">
            "Adéntrate en un mundo de emoción y velocidad. Descubre la
            excelencia en cada detalle mientras exploras nuestras exclusivas
            motocicletas de lujo. Bienvenido al lugar donde tus sueños de
            aventura toman forma."
          </p>
          <Link onClick={() => setCategory('')} to={'/products'} className="btn text-lg">Conoce Nuestras Motos </Link>
        </div>
      </div>
    </div>
  );
}
export default HeroHome