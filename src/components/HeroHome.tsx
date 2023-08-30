const HeroHome = () => {
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage:
          "url(../src/assets/HeroBG.jpg)",
      }}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-slate-200">
        <div className="max-w-md">
          <h1 className="mb-8 text-5xl font-bold text-white">Welcome To Luxury Motorcycles</h1>
          <p className="mb-7 text-lg">
            "Adéntrate en un mundo de emoción y velocidad. Descubre la
            excelencia en cada detalle mientras exploras nuestras exclusivas
            motocicletas de lujo. Bienvenido al lugar donde tus sueños de
            aventura toman forma."
          </p>
          <button className="btn">Get Started</button>
        </div>
      </div>
    </div>
  );
}
export default HeroHome