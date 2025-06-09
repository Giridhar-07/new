import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroScene from "./HeroScene";
import LoadingScreen from "./LoadingScreen";
import "./LandingPage.css";

gsap.registerPlugin(ScrollTrigger);

function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const featuresRef = useRef();
  const aboutRef = useRef();
  const amenitiesRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    const initAnimations = () => {
      if (!featuresRef.current || !aboutRef.current || !amenitiesRef.current) {
        return;
      }

      // Clear any existing ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      // Animate features section
      gsap.from(featuresRef.current.children || [], {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 1,
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
      });

      // Animate about section
      gsap.from(aboutRef.current, {
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 1,
        },
        y: 50,
        opacity: 0,
        duration: 1,
      });

      // Animate amenities section
      gsap.from(amenitiesRef.current.children || [], {
        scrollTrigger: {
          trigger: amenitiesRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 1,
        },
        scale: 0.8,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
      });
    }

    // Initialize animations after a short delay to ensure DOM is ready
    const timer = setTimeout(initAnimations, 100);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Re-run animations when loading state changes
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="landing-page">
      <motion.header className="hero" style={{ y }}>
        <HeroScene />
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Welcome to Our Luxury Hotel
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            Experience comfort, elegance, and exceptional service
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <Link to="/rooms" className="cta-button hover-effect">
              Book Now
            </Link>
          </motion.div>
        </motion.div>
      </motion.header>

      <section className="features" ref={featuresRef}>
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Why Choose Us
        </motion.h2>
        <div className="features-grid">
          <motion.div
            className="feature-card hover-effect"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <img
              src="/images/features/luxurious-room.svg"
              alt="Luxurious Rooms"
            />
            <h3>Luxurious Rooms</h3>
            <p>
              Our elegantly designed rooms provide the perfect blend of comfort
              and sophistication.
            </p>
          </motion.div>
          <motion.div
            className="feature-card hover-effect"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img
              src="/images/features/restaurant.svg"
              alt="Fine Dining"
            />
            <h3>Fine Dining</h3>
            <p>
              Experience exquisite cuisine prepared by our world-class chefs
              in our elegant restaurants.
            </p>
          </motion.div>
          <motion.div
            className="feature-card hover-effect"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <img
              src="/images/features/spa.svg"
              alt="Wellness Center"
            />
            <h3>Wellness Center</h3>
            <p>
              Rejuvenate your body and mind in our state-of-the-art spa
              and wellness facilities.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="about" ref={aboutRef}>
        <motion.div 
          className="about-content"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>About Our Hotel</h2>
          <p>
            Nestled in a prime location, our hotel offers a perfect retreat for
            both business and leisure travelers. With state-of-the-art amenities
            and personalized service, we ensure your stay is nothing short of
            exceptional.
          </p>
        </motion.div>
      </section>

      <section className="amenities">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Hotel Amenities
        </motion.h2>
        <div className="amenities-grid" ref={amenitiesRef}>
          <motion.div
            className="amenity hover-effect"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              24/7 Concierge
            </motion.h3>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Our dedicated concierge staff is available round the clock to assist you with
              any requests, from travel arrangements to local recommendations.
            </motion.p>
          </motion.div>

          <motion.div
            className="amenity hover-effect"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Gourmet Dining
            </motion.h3>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Savor exquisite cuisine at our signature restaurants, featuring innovative
              menus crafted by renowned chefs using the finest ingredients.
            </motion.p>
          </motion.div>

          <motion.div
            className="amenity hover-effect"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Luxury Spa
            </motion.h3>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Indulge in transformative treatments at our world-class spa, featuring
              premium products and expert therapists for ultimate relaxation.
            </motion.p>
          </motion.div>

          <motion.div
            className="amenity hover-effect"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Fitness Center
            </motion.h3>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              Maintain your fitness routine in our state-of-the-art gym equipped with
              the latest exercise equipment and personal training services.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <motion.section 
        className="cta"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="cta-content glass-effect">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Ready to Experience Luxury?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Book your stay now and enjoy our exclusive offers.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/rooms" className="cta-button hover-effect">
              View Rooms
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}

export default LandingPage;
