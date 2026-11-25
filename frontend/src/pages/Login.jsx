import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  motion,
  AnimatePresence
} from "framer-motion";

import {
  ArrowRight,
  LockKeyhole,
  Mail,
  Sparkles
} from "lucide-react";

import api from "../services/api";


function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [welcomeUser, setWelcomeUser] = useState(null);
  const [isLeaving, setIsLeaving] = useState(false);


  const getWelcomeRole = () => {
    if (!welcomeUser) {
      return "client";
    }

    if (welcomeUser.role === "admin") {
      return "admin";
    }

    if (welcomeUser.role === "freelancer") {
      return "freelancer";
    }

    return "client";
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);
    setIsLeaving(false);

    try {
      const response = await api.post(
        "/auth/login",
        {
          email,
          password
        }
      );

      const user = response.data.user;
      const token = response.data.token;

      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      setWelcomeUser(user);

      setTimeout(() => {
        setIsLeaving(true);
      }, 1900);

      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/admin");

        } else if (user.role === "freelancer") {
          navigate("/freelancer");

        } else {
          navigate("/client");
        }
      }, 2700);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to sign in. Please check your details."
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-page">

      <div className="login-glow login-glow-one" />
      <div className="login-glow login-glow-two" />


      <section className="login-visual">

        <motion.div
          className="login-visual-content"
          initial={{
            opacity: 0,
            y: 24
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.7
          }}
        >

          <div className="badge badge-red">
            <Sparkles size={14} />
            HustleHub
          </div>


          <h1 className="login-heading">
            HUSTLEHUB
          </h1>


          <p className="login-copy">
            Discover skilled freelancers, book premium
            services and move from idea to execution faster.
            Bring your ideas to life.
          </p>


          <div className="login-stat-row">

            <div>
              <strong>
                Fast
              </strong>

              <span>
                Simple booking
              </span>
            </div>


            <div>
              <strong>
                Secure
              </strong>

              <span>
                Protected access
              </span>
            </div>


            <div>
              <strong>
                Focused
              </strong>

              <span>
                Built for results
              </span>
            </div>

          </div>

        </motion.div>

      </section>


      <section className="login-panel">

        <motion.div
          className="login-card"
          initial={{
            opacity: 0,
            x: 28
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

          <div className="login-brand">

            <span className="brand-mark">
              H
            </span>

            <span>
              HUSTLEHUB
            </span>

          </div>


          <div className="login-header">

            <p className="eyebrow">
              Welcome back
            </p>

            <h2>
              Sign in to continue.
            </h2>

            <p>
              Access your gigs, bookings, income and
              marketplace dashboard.
            </p>

          </div>


          <form
            onSubmit={handleSubmit}
            className="login-form"
          >

            <div className="form-group">

              <label
                className="form-label"
                htmlFor="email"
              >
                Email address
              </label>

              <div className="input-shell">

                <Mail size={18} />

                <input
                  id="email"
                  className="form-input login-input"
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


            <div className="form-group">

              <label
                className="form-label"
                htmlFor="password"
              >
                Password
              </label>

              <div className="input-shell">

                <LockKeyhole size={18} />

                <input
                  id="password"
                  className="form-input login-input"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                />

              </div>

            </div>


            <div className="login-options">

              <label className="remember-row">

                <input
                  type="checkbox"
                />

                <span>
                  Remember me
                </span>

              </label>


              <button
                type="button"
                className="text-button"
              >
                Forgot password? Reset it here
              </button>

            </div>


            {error && (

              <motion.div
                className="login-error"
                initial={{
                  opacity: 0,
                  y: -6
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
              >
                {error}
              </motion.div>

            )}


            <button
              type="submit"
              className="btn btn-primary login-submit"
              disabled={loading}
            >

              {loading
                ? "Signing in..."
                : "Sign in"
              }

              {!loading && (
                <ArrowRight size={18} />
              )}

            </button>

          </form>


          <div className="login-footer">

            <span>
              New to HustleHub?
            </span>

            <button
              type="button"
              className="text-button strong"
              onClick={() =>
                navigate("/register")
              }
            >
              Create an account
            </button>

          </div>

        </motion.div>

      </section>


      <AnimatePresence>

        {welcomeUser && (

          <motion.div
            className={`welcome-overlay welcome-${getWelcomeRole()}`}
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: isLeaving
                ? 0
                : 1
            }}
            exit={{
              opacity: 0
            }}
            transition={{
              duration: isLeaving
                ? 0.7
                : 0.5
            }}
          >

            <motion.div
              className="welcome-content"
              initial={{
                opacity: 0,
                y: 25,
                scale: 0.97
              }}
              animate={{
                opacity: isLeaving
                  ? 0
                  : 1,

                y: isLeaving
                  ? -15
                  : 0,

                scale: isLeaving
                  ? 1.02
                  : 1
              }}
              transition={{
                duration: 0.7,
                ease: "easeOut"
              }}
            >

              <p className="welcome-eyebrow">
                HUSTLEHUB
              </p>


              <h1>
                Welcome back,

                <span>
                  {welcomeUser.name}.
                </span>
              </h1>


              <motion.div
                className="welcome-line"
                initial={{
                  width: 0
                }}
                animate={{
                  width: isLeaving
                    ? 0
                    : 90
                }}
                transition={{
                  duration: 0.8,
                  delay: isLeaving
                    ? 0
                    : 0.5
                }}
              />

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
}


export default Login;