import React from "react";

export default function Contact() {
  return (
    <>
      <div className="container-fluid bg-light page-header py-5 mb-5">
        <div className="container text-center py-5">
          <h1 className="display-1">Contact</h1>
        </div>
      </div>

      <div className="container-fluid py-5">
        <div className="container">
          <div className="text-center">
            <h1 className="font-dancing-script text-primary">Contact</h1>
            <h1 className="mb-5">Have Any Query? Contact Us</h1>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-7">
              <p className="text-center mb-4">
                The contact form is currently inactive. Get a functional and working contact form with Ajax &amp; PHP in a few minutes.
              </p>
              <form>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input type="text" className="form-control" id="name" placeholder="Your Name" />
                      <label htmlFor="name">Your Name</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input type="email" className="form-control" id="email" placeholder="Your Email" />
                      <label htmlFor="email">Your Email</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating">
                      <input type="text" className="form-control" id="subject" placeholder="Subject" />
                      <label htmlFor="subject">Subject</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating">
                      <textarea className="form-control" placeholder="Leave a message here" id="message" style={{height:150}}></textarea>
                      <label htmlFor="message">Message</label>
                    </div>
                  </div>
                  <div className="col-12 text-center">
                    <button className="btn btn-primary py-3 px-5" type="submit">Send Message</button>
                  </div>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
