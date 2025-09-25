import React from "react";
import { useNavigate } from "react-router-dom";

const servicesData = [
  { id: 'haircut', img: "haircut.png", title: "Haircut", description: "Professional hair cutting and styling services by our expert stylists.", price: "$25 - $75", duration: "45 min" },
  { id: 'makeup', img: "makeup.png", title: "Makeup", description: "Professional makeup application for all occasions and events.", price: "$40 - $120", duration: "60 min" },
  { id: 'manicure', img: "manicure.png", title: "Manicure", description: "Complete nail care including shaping, polishing, and nail art.", price: "$20 - $50", duration: "30 min" },
  { id: 'pedicure', img: "pedicure.png", title: "Pedicure", description: "Relaxing foot care treatment with massage and nail beautification.", price: "$25 - $60", duration: "45 min" },
  { id: 'massage', img: "massage.png", title: "Massage", description: "Therapeutic massage treatments for relaxation and wellness.", price: "$50 - $150", duration: "60-90 min" },
  { id: 'skincare', img: "skin-care.png", title: "Skin Care", description: "Facial treatments and skincare services for healthy, glowing skin.", price: "$45 - $200", duration: "75 min" },
];

export default function Services() {
  const navigate = useNavigate();

  // Hàm xử lý khi bấm Book Now
  const handleBooking = (serviceId) => {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      navigate("/login");
      return;
    }

    //   link booking form 
    navigate(`/services/${serviceId}`);
  };

  return (
    <>
      <div className="container-fluid bg-light page-header py-5 mb-5">
        <div className="container text-center py-5">
          <h1 className="display-1">Services</h1>
          <p className="lead">Discover our premium beauty and wellness services</p>
        </div>
      </div>

      <div className="container-fluid service py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h1 className="font-dancing-script text-primary">Our Services</h1>
            <h1 className="mb-3">Explore Our Services</h1>
            <p className="text-muted">
              From hair styling to skincare, we offer comprehensive beauty services 
              to help you look and feel your best.
            </p>
          </div>
          
          <div className="row g-4">
            {servicesData.map((service) => (
              <div className="col-md-6 col-lg-4" key={service.id}>
                <div className="service-item h-100 p-4 border rounded shadow-sm position-relative overflow-hidden">
                  <div className="text-center mb-4">
                    <img 
                      className="img-fluid" 
                      src={`/assets/img/${service.img}`} 
                      alt={service.title}
                      style={{ height: '80px', objectFit: 'contain' }}
                    />
                  </div>
                  
                  <div className="text-center">
                    <h3 className="mb-3 text-primary">{service.title}</h3>
                    <p className="mb-3 text-muted">{service.description}</p>
                    
                    <div className="row g-2 mb-4">
                      <div className="col-6">
                        <div className="bg-light p-2 rounded">
                          <small className="text-muted d-block">Price Range</small>
                          <strong className="text-primary">{service.price}</strong>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="bg-light p-2 rounded">
                          <small className="text-muted d-block">Duration</small>
                          <strong className="text-primary">{service.duration}</strong>
                        </div>
                      </div>
                    </div>
                    
                    <div className="d-grid gap-2">
                      <button 
                        className="btn btn-primary btn-lg"
                        onClick={() => handleBooking(service.id)}
                      >
                        <i className="bi bi-calendar-plus me-2"></i>
                        Book Now
                      </button>
                    </div>
                  </div>
                  
                  <div 
                    className="position-absolute top-0 end-0 bg-primary" 
                    style={{
                      width: '60px',
                      height: '60px',
                      clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)',
                      opacity: 0.1
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
