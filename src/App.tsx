import CarouselHome from "./components/Home/CarouselHome"
import FormFooter from "./components/Home/FormFooter"
import HeroHome from "./components/Home/HeroHome"
import NavBar from "./components/Home/NavBar"

function App() {
  

  return (
    <div className="main">
      <NavBar />
      <HeroHome />
      <CarouselHome />
      <FormFooter />
    </div>
  )
}

export default App
