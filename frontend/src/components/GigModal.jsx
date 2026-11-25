import { motion, AnimatePresence } from "framer-motion";
import {
  BriefcaseBusiness,
  CheckCircle2,
  X
} from "lucide-react";

function GigModal({
  gig,
  isOpen,
  onClose,
  onBook,
  booking,
  message
}) {
  return (
    <AnimatePresence>
      {isOpen && gig && (
        <motion.div
          className="gig-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="gig-modal"
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.96
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.97
            }}
            transition={{
              duration: 0.3
            }}
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* Close button */}
            <button
              className="gig-modal-close"
              onClick={onClose}
            >
              <X size={20} />
            </button>

            {/* Category */}
            <span className="badge badge-red">
              {gig.category}
            </span>

            {/* Gig title */}
            <h2>
              {gig.title}
            </h2>

            {/* Freelancer */}
            <div className="gig-modal-freelancer">
              <BriefcaseBusiness size={18} />

              <span>
                {gig.freelancer?.name ||
                  "HustleHub Freelancer"}
              </span>
            </div>

            {/* Description */}
            <p className="gig-modal-description">
              {gig.description}
            </p>

            {/* Price section */}
            <div className="gig-modal-price">
              <span>
                Service price
              </span>

              <strong>
                R{gig.price}
              </strong>
            </div>

            {/* Booking message */}
            {message && (
              <motion.div
                className="booking-message"
                initial={{
                  opacity: 0,
                  y: 8
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
              >
                <CheckCircle2 size={18} />

                {message}
              </motion.div>
            )}

            {/* Book button */}
            <button
              className="btn btn-primary gig-book-button"
              onClick={() =>
                onBook(gig)
              }
              disabled={booking}
            >
              {booking
                ? "Booking..."
                : `Book for R${gig.price}`}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default GigModal;