import React from "react";
import { Link } from "react-router-dom";

const items = [
  { img: "haircut.png", title: "Haircut" },
  { img: "makeup.png", title: "Makeup" },
  { img: "manicure.png", title: "Manicure" },
  { img: "pedicure.png", title: "Pedicure" },
  { img: "massage.png", title: "Massage" },
  { img: "skin-care.png", title: "SkinCare" },
];

export default function Services() {
  return (
    <>
      <div className="container-fluid bg-light page-header py-5 mb-5">
        <div className="container text-center py-5">
          <h1 className="display-1">Services</h1>
        </div>
      </div>

      <div className="container-fluid service py-5">
        <div className="container">
          <div className="text-center">
            <h1 className="font-dancing-script text-primary">Our Services</h1>
            <h1 className="mb-5">Explore Our Services</h1>
          </div>
          <div className="row g-4 g-md-0 text-center">
            {items.map((s, i) => (
              <div className="col-md-6 col-lg-4" key={s.title}>
                <div className={`service-item h-100 p-4 border-bottom ${i % 3 !== 2 ? "border-end" : ""}`}>
                  <img className="img-fluid" src={`/assets/img/${s.img}`} alt={s.title} />
                  <h3 className="mb-3">{s.title}</h3>
                  <p className="mb-3">
                    Clita erat ipsum et lorem et sit, sed stet no labore lorem sit clita duo justo.
                  </p>
                  <Link to={`/${s.title.toLowerCase()}`} className="btn btn-sm btn-primary text-uppercase">
                    Book Now <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}