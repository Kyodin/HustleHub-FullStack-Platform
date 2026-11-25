// React state
import { useState } from "react";

// React Router navigation
import { useNavigate } from "react-router-dom";

// Animations
import { motion } from "framer-motion";

import "./Register.css";

// Icons
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Mail,
  LockKeyhole,
  UserRound
} from "lucide-react";

// API connection
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");

  // UI state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // REGISTER USER
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
        role
      });

      setMessage(
        "Account created successfully. Redirecting to login..."
      );

      // Small success delay before returning to login
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to create your account."
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="register-page">

      <div className="register-glow register-glow-one" />
      <div className="register-glow register-glow-two" />


      {/*
          LEFT SIDE
         */}

      <section className="register-visual">

        <motion.div
          className="register-visual-content"

          initial={{
            opacity: 0,
            y: 25
          }}

          animate={{
            opacity: 1,
            y: 0
          }}

          transition={{
            duration: 0.7
          }}
        >

          <p className="eyebrow">
            Join HustleHub
          </p>


          <h1>
            BUILD.
            <span>BOOK.</span>
            GROW.
          </h1>


          <p>
            Whether you're looking for skilled talent
            or building your freelance business,
            HustleHub gives you one place to move
            from opportunity to results.
             Turn your ideas into the real thing.
          </p>


          <div className="register-feature-row">

            <div>
              <strong>
                Clients
              </strong>

              <span>
                Discover and book services
              </span>
            </div>


            <div>
              <strong>
                Freelancers
              </strong>

              <span>
                Create gigs and earn
              </span>
            </div>

          </div>

        </motion.div>

      </section>


      {/*
          REGISTER FORM
        */}

      <section className="register-panel">

        <motion.div
          className="register-card"

          initial={{
            opacity: 0,
            x: 30
          }}

          animate={{
            opacity: 1,
            x: 0
          }}

          transition={{
            duration: 0.65,
            delay: 0.1
          }}
        >

          {/* Back to login */}
          <button
            type="button"
            className="register-back"
            onClick={() =>
              navigate("/login")
            }
          >
            <ArrowLeft size={17} />
            Back to login
          </button>


          <div className="register-brand">

            <span className="brand-mark">
              H
            </span>

            <span>
              HUSTLEHUB
            </span>

          </div>


          <div className="register-header">

            <p className="eyebrow">
              Create account
            </p>

            <h2>
              Start your journey.
            </h2>

            <p>
              Choose how you want to use HustleHub
              and create your secure account.
            </p>

          </div>


          <form
            className="register-form"
            onSubmit={handleSubmit}
          >

            {/* Full name */}
            <div className="form-group">

              <label className="form-label">
                Full name
              </label>

              <div className="input-shell">

                <UserRound size={18} />

                <input
                  className="form-input register-input"
                  type="text"
                  placeholder="Your full name"

                  value={name}

                  onChange={(event) =>
                    setName(event.target.value)
                  }

                  required
                />

              </div>

            </div>


            {/* Email */}
            <div className="form-group">

              <label className="form-label">
                Email address
              </label>

              <div className="input-shell">

                <Mail size={18} />

                <input
                  className="form-input register-input"
                  type="email"
                  placeholder="you@example.com"

                  value={email}

                  onChange={(event) =>
                    setEmail(event.target.value)
                  }

                  required
                />

              </div>

            </div>


            {/* Password */}
            <div className="form-group">

              <label className="form-label">
                Password
              </label>

              <div className="input-shell">

                <LockKeyhole size={18} />

                <input
                  className="form-input register-input"
                  type="password"
                  placeholder="Create a strong password"

                  value={password}

                  onChange={(event) =>
                    setPassword(event.target.value)
                  }

                  required
                />

              </div>

            </div>


            {/* Account type */}
            <div className="form-group">

              <label className="form-label">
                Account type
              </label>


              <div className="role-selector">

                {/* Client role */}
                <button
                  type="button"

                  className={
                    role === "client"
                      ? "role-option active"
                      : "role-option"
                  }

                  onClick={() =>
                    setRole("client")
                  }
                >

                  <UserRound size={19} />

                  <div>
                    <strong>
                      Client
                    </strong>

                    <span>
                      Find and book freelancers
                    </span>
                  </div>

                </button>


                {/* Freelancer role */}
                <button
                  type="button"

                  className={
                    role === "freelancer"
                      ? "role-option active"
                      : "role-option"
                  }

                  onClick={() =>
                    setRole("freelancer")
                  }
                >

                  <BriefcaseBusiness size={19} />

                  <div>
                    <strong>
                      Freelancer
                    </strong>

                    <span>
                      Create gigs and earn
                    </span>
                  </div>

                </button>

              </div>

            </div>


            {/* Error */}
            {error && (
              <motion.div
                className="login-error"

                initial={{
                  opacity: 0,
                  y: -5
                }}

                animate={{
                  opacity: 1,
                  y: 0
                }}
              >
                {error}
              </motion.div>
            )}


            {/* Success */}
            {message && (
              <motion.div
                className="login-success"

                initial={{
                  opacity: 0,
                  y: -5
                }}

                animate={{
                  opacity: 1,
                  y: 0
                }}
              >
                {message}
              </motion.div>
            )}


            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary register-submit"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create account"}

              {!loading && (
                <ArrowRight size={18} />
              )}
            </button>

          </form>

        </motion.div>

      </section>

    </div>
  );
}

export default Register;