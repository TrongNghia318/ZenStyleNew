import React from "react";
import { Link } from "react-router-dom";

const servicesData = [
  { 
    id: 'haircut',
    img: "haircut.png", 
    title: "Haircut",
    description: "Professional hair cutting and styling services by our expert stylists.",
    price: "$25 - $75",
    duration: "45 min"
  },
  { 
    id: 'makeup',
    img: "makeup.png", 
    title: "Makeup",
    description: "Professional makeup application for all occasions and events.",
    price: "$40 - $120",
    duration: "60 min"
  },
  { 
    id: 'manicure',
    img: "manicure.png", 
    title: "Manicure",
    description: "Complete nail care including shaping, polishing, and nail art.",
    price: "$20 - $50",
    duration: "30 min"
  },
  { 
    id: 'pedicure',
    img: "pedicure.png", 
    title: "Pedicure",
    description: "Relaxing foot care treatment with massage and nail beautification.",
    price: "$25 - $60",
    duration: "45 min"
  },
  { 
    id: 'massage',
    img: "massage.png", 
    title: "Massage",
    description: "Therapeutic massage treatments for relaxation and wellness.",
    price: "$50 - $150",
    duration: "60-90 min"
  },
  { 
    id: 'skincare',
    img: "skin-care.png", 
    title: "Skin Care",
    description: "Facial treatments and skincare services for healthy, glowing skin.",
    price: "$45 - $200",
    duration: "75 min"
  },
];

export default function Services() {
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
            {servicesData.map((service, index) => (
              <div className="col-md-6 col-lg-4" key={service.id}>
                <div className="service-item h-100 p-4 border rounded shadow-sm position-relative overflow-hidden">
                  {/* Service Image */}
                  <div className="text-center mb-4">
                    <img 
                      className="img-fluid" 
                      src={`/assets/img/${service.img}`} 
                      alt={service.title}
                      style={{ height: '80px', objectFit: 'contain' }}
                    />
                  </div>
                  
                  {/* Service Info */}
                  <div className="text-center">
                    <h3 className="mb-3 text-primary">{service.title}</h3>
                    <p className="mb-3 text-muted">
                      {service.description}
                    </p>
                    
                    {/* Service Details */}
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
                    
                    {/* Action Buttons */}
                    <div className="d-grid gap-2">
                      <Link 
                        className="btn btn-primary btn-lg"
                        to={`/services/${service.id}`}
                      >
                        <i className="bi bi-calendar-plus me-2"></i>
                        Book Now
                      </Link>
                      
                      
                    </div>
                  </div>
                  
                  {/* Decorative Element */}
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
          
          {/* Call to Action Section */}
          <div className="row mt-5">
            <div className="col-12">
              <div className="bg-primary text-white p-5 rounded text-center">
                <h2 className="mb-3">Ready to Transform Your Look?</h2>
                <p className="mb-4 lead">
                  Book multiple services and save! Our expert team is here to provide you 
                  with a complete beauty experience tailored to your needs.
                </p>
                <div className="row justify-content-center">
                  <div className="col-auto">
                    <Link to="/contact" className="btn btn-light btn-lg me-3">
                      <i className="bi bi-telephone me-2"></i>
                      Call Us: +012 345 67890
                    </Link>
                  </div>
                  <div className="col-auto">
                    <Link to="/services/haircut" className="btn btn-outline-light btn-lg">
                      <i className="bi bi-calendar-heart me-2"></i>
                      Book Your First Service
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Info Section */}
          <div className="row mt-5">
            <div className="col-lg-8 mx-auto text-center">
              <div className="bg-light p-4 rounded">
                <h4 className="text-primary mb-3">Why Choose ZenStyle?</h4>
                <div className="row g-3">
                  <div className="col-md-3">
                    <div className="p-3">
                      <i className="bi bi-award text-primary fs-2 mb-2"></i>
                      <h6>Expert Staff</h6>
                      <small className="text-muted">Certified professionals</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="p-3">
                      <i className="bi bi-clock text-primary fs-2 mb-2"></i>
                      <h6>Flexible Hours</h6>
                      <small className="text-muted">Open 7 days a week</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="p-3">
                      <i className="bi bi-shield-check text-primary fs-2 mb-2"></i>
                      <h6>Safe & Clean</h6>
                      <small className="text-muted">Sanitized equipment</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="p-3">
                      <i className="bi bi-heart text-primary fs-2 mb-2"></i>
                      <h6>Customer Care</h6>
                      <small className="text-muted">Your satisfaction first</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}