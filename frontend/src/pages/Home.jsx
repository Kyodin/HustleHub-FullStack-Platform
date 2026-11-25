import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Code2,
  Palette,
  ShieldCheck,
  Sparkles,
  UserRound,
  Zap
} from "lucide-react";

import "./Home.css";


function Home() {
  const navigate = useNavigate();

  const categories = [
    {
      icon: Code2,
      number: "01",
      title: "Development",
      description:
        "Web applications, APIs and digital products built by skilled developers."
    },
    {
      icon: Palette,
      number: "02",
      title: "Design",
      description:
        "Branding, interface design and creative work that makes ideas stand out."
    },
    {
      icon: BriefcaseBusiness,
      number: "03",
      title: "Business",
      description:
        "Professional services designed to move projects and businesses forward."
    }
  ];


  return (
    <div className="home-page">

      {/* NAVIGATION */}

      <nav className="home-nav">

        <button
          className="home-brand"
          onClick={() => window.scrollTo({
            top: 0,
            behavior: "smooth"
          })}
        >
          <span className="home-brand-mark">
            H
          </span>

          <span>
            HUSTLEHUB
          </span>
        </button>


        <div className="home-nav-center">

          <a href="#discover">
            Discover
          </a>

          <a href="#clients">
            For Clients
          </a>

          <a href="#freelancers">
            For Freelancers
          </a>

          <a href="#how-it-works">
            How It Works
          </a>

        </div>


        <div className="home-nav-actions">

          <button
            className="home-login-button"
            onClick={() =>
              navigate("/login")
            }
          >
            Sign in
          </button>


          <button
            className="home-start-button"
            onClick={() =>
              navigate("/register")
            }
          >
            Get started

            <ArrowRight size={16} />
          </button>

        </div>

      </nav>


      {/* HERO */}

      <main>

        <section className="home-hero">

          <div className="home-hero-grid" />

          <div className="home-orb home-orb-one" />
          <div className="home-orb home-orb-two" />


          <motion.div
            className="home-hero-content"
            initial={{
              opacity: 0,
              y: 30
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1]
            }}
          >

            <motion.div
              className="home-hero-eyebrow"
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1
              }}
              transition={{
                delay: 0.2,
                duration: 0.7
              }}
            >

              <span className="home-live-dot" />

              THE MODERN FREELANCE MARKETPLACE

            </motion.div>


            <h1 className="home-hero-title">

              <span>
                BUILD
              </span>

              <span className="home-outline-word">
                WHAT'S NEXT.
              </span>

            </h1>


            <div className="home-hero-bottom">

              <p>
                Find skilled freelancers.
                Book premium services.
                Turn ambitious ideas into real work.
              </p>


              <div className="home-hero-actions">

                <button
                  className="home-primary-cta"
                  onClick={() =>
                    navigate("/register")
                  }
                >
                  Start building

                  <ArrowRight size={18} />
                </button>


                <a
                  className="home-secondary-cta"
                  href="#discover"
                >
                  Explore HustleHub
                </a>

              </div>

            </div>

          </motion.div>


          <div className="home-hero-strip">

            <div>
              <strong>
                TALENT
              </strong>

              <span>
                Discover specialists
              </span>
            </div>


            <div>
              <strong>
                SECURE
              </strong>

              <span>
                Protected platform
              </span>
            </div>


            <div>
              <strong>
                FAST
              </strong>

              <span>
                From idea to action
              </span>
            </div>


            <div>
              <strong>
                SIMPLE
              </strong>

              <span>
                One connected experience
              </span>
            </div>

          </div>

        </section>


        {/* MANIFESTO */}

        <section
          className="home-statement-section"
          id="discover"
        >

          <div className="home-container">

            <motion.div
              className="home-statement"
              initial={{
                opacity: 0,
                y: 30
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true,
                amount: 0.3
              }}
              transition={{
                duration: 0.7
              }}
            >

              <p className="home-section-label">
                THE MARKETPLACE
              </p>


              <h2>
                Exceptional work starts
                with the right people.
              </h2>


              <p className="home-statement-copy">
                HustleHub connects clients with freelancers
                who can transform opportunities into results.
                One marketplace. Better collaboration.
                Less friction.
              </p>

            </motion.div>

          </div>

        </section>


        {/* CATEGORIES */}

        <section className="home-categories-section">

          <div className="home-container">

            <div className="home-section-heading">

              <div>
                <p className="home-section-label">
                  DISCOVER
                </p>

                <h2>
                  Find the expertise
                  your idea deserves.
                </h2>
              </div>


              <button
                onClick={() =>
                  navigate("/register")
                }
              >
                Explore services

                <ArrowRight size={17} />
              </button>

            </div>


            <div className="home-category-grid">

              {categories.map((category, index) => {
                const Icon = category.icon;

                return (

                  <motion.article
                    className="home-category-card"
                    key={category.title}
                    initial={{
                      opacity: 0,
                      y: 25
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0
                    }}
                    viewport={{
                      once: true
                    }}
                    transition={{
                      duration: 0.55,
                      delay: index * 0.08
                    }}
                  >

                    <div className="home-category-top">

                      <span>
                        {category.number}
                      </span>

                      <Icon size={25} />

                    </div>


                    <div>

                      <h3>
                        {category.title}
                      </h3>

                      <p>
                        {category.description}
                      </p>

                    </div>


                    <div className="home-category-arrow">
                      <ChevronRight size={21} />
                    </div>

                  </motion.article>

                );
              })}

            </div>

          </div>

        </section>


        {/* CLIENT EXPERIENCE */}

        <section
          className="home-role-section home-client-section"
          id="clients"
        >

          <div className="home-role-number">
            01
          </div>


          <div className="home-container home-role-layout">

            <motion.div
              className="home-role-copy"
              initial={{
                opacity: 0,
                x: -30
              }}
              whileInView={{
                opacity: 1,
                x: 0
              }}
              viewport={{
                once: true,
                amount: 0.3
              }}
              transition={{
                duration: 0.7
              }}
            >

              <p className="home-section-label">
                FOR CLIENTS
              </p>


              <h2>
                Your next idea
                deserves momentum.
              </h2>


              <p>
                Discover freelance services,
                compare opportunities and manage
                your bookings from one focused
                workspace.
              </p>


              <div className="home-role-points">

                <span>
                  <Check size={17} />
                  Browse specialist services
                </span>

                <span>
                  <Check size={17} />
                  Secure account access
                </span>

                <span>
                  <Check size={17} />
                  Track every booking
                </span>

              </div>


              <button
                className="home-role-button"
                onClick={() =>
                  navigate("/register")
                }
              >
                Join as a client

                <ArrowRight size={18} />
              </button>

            </motion.div>


            <motion.div
              className="home-preview client-preview"
              initial={{
                opacity: 0,
                x: 30
              }}
              whileInView={{
                opacity: 1,
                x: 0
              }}
              viewport={{
                once: true,
                amount: 0.3
              }}
              transition={{
                duration: 0.7
              }}
            >

              <div className="preview-topbar">

                <div>
                  <span />
                  <span />
                  <span />
                </div>

                <p>
                  CLIENT / DISCOVER
                </p>

              </div>


              <div className="preview-content">

                <p className="preview-label">
                  GOOD AFTERNOON
                </p>


                <h3>
                  What will you
                  build next?
                </h3>


                <div className="preview-stats">

                  <div>
                    <strong>
                      12
                    </strong>

                    <span>
                      AVAILABLE GIGS
                    </span>
                  </div>


                  <div>
                    <strong>
                      03
                    </strong>

                    <span>
                      BOOKINGS
                    </span>
                  </div>

                </div>


                <div className="preview-service">

                  <div>
                    <span>
                      DEVELOPMENT
                    </span>

                    <strong>
                      Full Stack Web Application
                    </strong>
                  </div>

                  <p>
                    R 8,500
                  </p>

                </div>


                <div className="preview-service">

                  <div>
                    <span>
                      DESIGN
                    </span>

                    <strong>
                      Premium Interface Design
                    </strong>
                  </div>

                  <p>
                    R 4,200
                  </p>

                </div>

              </div>

            </motion.div>

          </div>

        </section>


        {/* FREELANCER EXPERIENCE */}

        <section
          className="home-role-section home-freelancer-section"
          id="freelancers"
        >

          <div className="home-role-number">
            02
          </div>


          <div className="home-container home-role-layout home-role-reverse">

            <motion.div
              className="home-preview freelancer-preview"
              initial={{
                opacity: 0,
                x: -30
              }}
              whileInView={{
                opacity: 1,
                x: 0
              }}
              viewport={{
                once: true,
                amount: 0.3
              }}
              transition={{
                duration: 0.7
              }}
            >

              <div className="preview-topbar">

                <div>
                  <span />
                  <span />
                  <span />
                </div>

                <p>
                  FREELANCER / PERFORMANCE
                </p>

              </div>


              <div className="preview-content">

                <p className="preview-label freelancer-label">
                  YOUR BUSINESS
                </p>


                <h3>
                  Performance
                  at a glance.
                </h3>


                <div className="freelancer-income-preview">

                  <span>
                    TOTAL EARNINGS
                  </span>

                  <strong>
                    R 32,450
                  </strong>

                  <small>
                    +18.4% this month
                  </small>

                </div>


                <div className="preview-chart">

                  <span style={{ height: "34%" }} />
                  <span style={{ height: "48%" }} />
                  <span style={{ height: "40%" }} />
                  <span style={{ height: "68%" }} />
                  <span style={{ height: "58%" }} />
                  <span style={{ height: "82%" }} />
                  <span style={{ height: "100%" }} />

                </div>

              </div>

            </motion.div>


            <motion.div
              className="home-role-copy freelancer-role-copy"
              initial={{
                opacity: 0,
                x: 30
              }}
              whileInView={{
                opacity: 1,
                x: 0
              }}
              viewport={{
                once: true,
                amount: 0.3
              }}
              transition={{
                duration: 0.7
              }}
            >

              <p className="home-section-label blue-label">
                FOR FREELANCERS
              </p>


              <h2>
                Your talent is
                a business.
              </h2>


              <p>
                Create services, receive bookings,
                monitor income and understand how
                your freelance business is performing.
              </p>


              <div className="home-role-points freelancer-points">

                <span>
                  <Check size={17} />
                  Publish and manage gigs
                </span>

                <span>
                  <Check size={17} />
                  Monitor income performance
                </span>

                <span>
                  <Check size={17} />
                  Manage incoming bookings
                </span>

              </div>


              <button
                className="home-role-button freelancer-role-button"
                onClick={() =>
                  navigate("/register")
                }
              >
                Become a freelancer

                <ArrowRight size={18} />
              </button>

            </motion.div>

          </div>

        </section>


        {/* HOW IT WORKS */}

        <section
          className="home-process-section"
          id="how-it-works"
        >

          <div className="home-container">

            <div className="home-process-heading">

              <p className="home-section-label">
                HOW IT WORKS
              </p>

              <h2>
                Less friction.
                More momentum.
              </h2>

            </div>


            <div className="home-process-grid">

              <div className="home-process-item">

                <div className="home-process-icon">
                  <Sparkles size={23} />
                </div>

                <span>
                  01
                </span>

                <h3>
                  Discover
                </h3>

                <p>
                  Browse services from freelancers
                  across multiple disciplines.
                </p>

              </div>


              <div className="home-process-item">

                <div className="home-process-icon">
                  <Zap size={23} />
                </div>

                <span>
                  02
                </span>

                <h3>
                  Book
                </h3>

                <p>
                  Choose the service that fits your
                  project and create your booking.
                </p>

              </div>


              <div className="home-process-item">

                <div className="home-process-icon">
                  <ShieldCheck size={23} />
                </div>

                <span>
                  03
                </span>

                <h3>
                  Build
                </h3>

                <p>
                  Manage the work from a secure,
                  focused HustleHub experience.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* FINAL CTA */}

        <section className="home-final-section">

          <div className="home-final-glow" />


          <motion.div
            className="home-final-content"
            initial={{
              opacity: 0,
              y: 30
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true,
              amount: 0.4
            }}
            transition={{
              duration: 0.7
            }}
          >

            <p className="home-section-label">
              HUSTLEHUB
            </p>


            <h2>
              Your next project
              starts here.
            </h2>


            <p>
              Find talent. Create opportunity.
              Build something worth remembering.
            </p>


            <div className="home-final-actions">

              <button
                className="home-primary-cta"
                onClick={() =>
                  navigate("/register")
                }
              >
                Create your account

                <ArrowRight size={18} />
              </button>


              <button
                className="home-final-signin"
                onClick={() =>
                  navigate("/login")
                }
              >
                Already a member? Sign in
              </button>

            </div>

          </motion.div>

        </section>

      </main>


      {/* FOOTER */}

      <footer className="home-footer">

        <div className="home-footer-brand">

          <span className="home-brand-mark">
            H
          </span>

          <span>
            HUSTLEHUB
          </span>

        </div>


        <p>
          Built for opportunity.
        </p>


        <span>
          © 2026 HustleHub
        </span>

      </footer>

    </div>
  );
}


export default Home;