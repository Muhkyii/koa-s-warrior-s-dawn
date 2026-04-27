import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

interface Props {
  id?: string;
  className?: string;
}

export const Section = ({ id, className = "", children }: PropsWithChildren<Props>) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.section>
);
