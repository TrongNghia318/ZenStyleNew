import React from "react";

const priceItems = [
  { img: "price-1.jpg", name: "Haircut", price: 49 },
  { img: "price-2.jpg", name: "Makeup", price: 79 },
  { img: "price-3.jpg", name: "Manicure", price: 59 },
  { img: "price-4.jpg", name: "Pedicure", price: 49 },
  { img: "price-5.jpg", name: "Massage", price: 39 },
  { img: "price-6.jpg", name: "Skin Care", price: 99 },
];

export default function Price() {
  return (
    <div className="container-fluid price px-0 py-5">
      <div className="row g-0">
        <div className="col-md-6">
          <div className="d-flex align-items-center h-100 bg-primary p-5">
            <div>
              <h1 className="font-dancing-script text-white">Pricing</h1>
              <h1 className="mb-0">Beauty Salon</h1>
              <h1 className="display-1 text-uppercase mb-5" style={{letterSpacing:10}}>Pricing</h1>
              <div className="row g-4 align-items-center">
                <div className="col-lg-6">
                  <div className="text-center bg-dark p-5">
                    <h4 className="text-white">Enjoy</h4>
                    <h1 className="display-1 text-white">20%</h1>
                    <p className="fs-2 text-white mb-0">Off</p>
                  </div>
                </div>
                <div className="col-lg-6">
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  <a className="btn btn-dark" href="#!">Get 20% Off</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="h-100 bg-dark p-5">
            {priceItems.map(item => (
              <div className="price-item mb-3 d-flex align-items-center" key={item.name}>
                <img className="img-fluid flex-shrink-0" src={`/assets/img/${item.img}`} alt={item.name} />
                <div className="text-end px-4 ms-auto">
                  <h6 className="text-uppercase text-primary">{item.name}</h6>
                  <h3 className="text-white mb-0">${item.price}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
