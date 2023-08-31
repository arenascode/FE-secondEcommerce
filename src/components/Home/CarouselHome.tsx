const CarouselHome = () => {
  return (
    <div className="carousel w-full mt-5 carouselHome">
      <div id="slide1" className="carousel-item relative w-full">
        <img
          src="../src/assets/carouselHome/carousel1.jpg"
          className="w-full h-full"
        />
        <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
          <a href="#slide4" className="btn btn-circle btn-sm">
            ❮
          </a>
          <a href="#slide2" className="btn btn-circle btn-sm">
            ❯
          </a>
        </div>
      </div>
      <div id="slide2" className="carousel-item relative w-full">
        <img
          src="../src/assets/carouselHome/carousel2.jpg"
          className="w-full object-bottom"
        />
        <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
          <a href="#slide1" className="btn btn-circle btn-sm">
            ❮
          </a>
          <a href="#slide3" className="btn btn-circle btn-sm">
            ❯
          </a>
        </div>
      </div>
      <div id="slide3" className="carousel-item relative w-full">
        <img
          src="../src/assets/carouselHome/carousel3.jpg"
          className="w-full"
        />
        <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
          <a href="#slide2" className="btn btn-circle btn-sm">
            ❮
          </a>
          <a href="#slide4" className="btn btn-circle btn-sm">
            ❯
          </a>
        </div>
      </div>
      <div id="slide4" className="carousel-item relative w-full">
        <img
          src="../src/assets/carouselHome/carousel4.jpg"
          className="w-full"
        />
        <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
          <a href="#slide3" className="btn btn-circle btn-sm">
            ❮
          </a>
          <a href="#slide1" className="btn btn-circle btn-sm">
            ❯
          </a>
        </div>
      </div>
    </div>
  );
}
export default CarouselHome