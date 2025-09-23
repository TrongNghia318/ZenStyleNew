import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CountUp from "react-countup";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function Home() {
  useEffect(() => { AOS.init({ duration: 700, once: true }); }, []);

  const headerSlides = [
    "/assets/img/hero-slider-1.jpg",
    "/assets/img/hero-slider-2.jpg",
    "/assets/img/hero-slider-3.jpg",
  ];

  const galleryImgs = [
    "/assets/img/gallery-1.jpg","/assets/img/gallery-2.jpg","/assets/img/gallery-3.jpg",
    "/assets/img/gallery-4.jpg","/assets/img/gallery-5.jpg","/assets/img/gallery-6.jpg",
  ];

  const [lightboxIdx, setLightboxIdx] = useState(-1);

  const sliderSettings = { dots:true, arrows:true, infinite:true, autoplay:true, speed:600 };

  return (
    <>
      {/* HERO */}
      <div className="container-fluid p-0 hero-header bg-light mb-5">
        <div className="container p-0">
          <div className="row g-0 align-items-center">
            <div className="col-lg-6 hero-header-text py-5">
              <div className="py-5 px-3 ps-lg-0">
                <h1 className="font-dancing-script text-primary" data-aos="fade-right">Welcome</h1>
                <h1 className="display-1 mb-4" data-aos="fade-right">Beauty Salon Fashion</h1>
                <div className="row g-4" data-aos="fade-right">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center">
                      <div className="btn-square btn btn-primary flex-shrink-0"><i className="fa fa-phone text-dark"></i></div>
                      <div className="px-3">
                        <h5 className="text-primary mb-0">Call Us</h5>
                        <p className="fs-5 text-dark mb-0">+123456789</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center">
                      <div className="btn-square btn btn-primary flex-shrink-0"><i className="fa fa-envelope text-dark"></i></div>
                      <div className="px-3">
                        <h5 className="text-primary mb-0">Mail Us</h5>
                        <p className="fs-5 text-dark mb-0">info@domain.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slider đổi từ Owl sang react-slick */}
            <div className="col-lg-6" data-aos="fade-left">
              <Slider {...sliderSettings}>
                {headerSlides.map((src, i) => (
                  <img key={i} className="img-fluid w-100" src={src} alt={`slide-${i}`} />
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </div>

      {/* ABOUT + COUNTERS */}
      <div className="container-fluid py-5">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-6" data-aos="fade-up">
              <img className="img-fluid mb-3" src="/assets/img/about.jpg" alt="about" />
              <div className="d-flex align-items-center bg-light">
                <div className="btn-square flex-shrink-0 bg-primary" style={{width:100,height:100}}>
                  <i className="fa fa-phone fa-2x text-dark"></i>
                </div>
                <div className="px-3">
                  <h3>+0123456789</h3>
                  <span>Call us direct 24/7 for a free consultation</span>
                </div>
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="150">
              <h1 className="font-dancing-script text-primary">About Us</h1>
              <h1 className="mb-5">Why People Choose Us!</h1>
              <p className="mb-4">Where craft meets care - just for you...</p>
              <div className="row g-3 mb-5">
                <div className="col-sm-6">
                  <div className="bg-light text-center p-4">
                    <i className="fas fa-calendar-alt fa-4x text-primary"></i>
                    <h1 className="display-5"><CountUp end={5} duration={2} /></h1>
                    <p className="text-dark text-uppercase mb-0">Years experience</p>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="bg-light text-center p-4">
                    <i className="fas fa-users fa-4x text-primary"></i>
                    <h1 className="display-5"><CountUp end={999} duration={2} /></h1>
                    <p className="text-dark text-uppercase mb-0">Happy Customers</p>
                  </div>
                </div>
              </div>
              <a className="btn btn-primary text-uppercase px-5 py-3" href="#">Read More</a>
            </div>
          </div>
        </div>
      </div>

      {/* SERVICES (giữ nguyên markup, dữ liệu tĩnh) */}
      <div className="container-fluid service py-5">
        <div className="container">
          <div className="text-center" data-aos="fade-up">
            <h1 className="font-dancing-script text-primary">Our Services</h1>
            <h1 className="mb-5">Explore Our Services</h1>
          </div>
        </div>
      </div>

      {lightboxIdx >= 0 && (
        <Lightbox
          mainSrc={galleryImgs[lightboxIdx]}
          nextSrc={galleryImgs[(lightboxIdx + 1) % galleryImgs.length]}
          prevSrc={galleryImgs[(lightboxIdx + galleryImgs.length - 1) % galleryImgs.length]}
          onCloseRequest={() => setLightboxIdx(-1)}
          onMovePrevRequest={() =>
            setLightboxIdx((lightboxIdx + galleryImgs.length - 1) % galleryImgs.length)
          }
          onMoveNextRequest={() =>
            setLightboxIdx((lightboxIdx + 1) % galleryImgs.length)
          }
        />
      )}
    </>
  );
}
