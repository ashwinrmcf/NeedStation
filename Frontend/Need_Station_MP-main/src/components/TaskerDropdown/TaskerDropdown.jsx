import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserCircle2, LogIn, UserPlus, Briefcase } from 'lucide-react';
import styles from './TaskerDropdown.module.css';
import './force-dropdown.css'; // Import special styling for Hindi dropdown fix

const TaskerDropdown = ({ isVisible }) => {
  // Animation variants
  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      y: -20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.05
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { 
        duration: 0.2,
        ease: "easeIn" 
      }
    }
  };

  // Animation for each item
  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div 
      className={styles.taskerDropdown}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={dropdownVariants}
    >
      <div className={styles.dropdownArrow}></div>
      <motion.div className={styles.dropdownContent}>
        <motion.div variants={itemVariants} className={styles.dropdownHeader}>
          <Briefcase size={20} />
          <span>Helper Portal</span>
        </motion.div>
        
        <div className={styles.dropdownDivider}></div>
        
        <motion.div variants={itemVariants}>
          <Link to="/worker-login" className={styles.dropdownItem}>
            <LogIn size={18} />
            <span>Login as Helper</span>
          </Link>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Link to="/worker-registration" state={{ fromHeader: true }} className={styles.dropdownItem}>
            <UserPlus size={18} />
            <span>Register as Helper</span>
          </Link>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Link to="/why-become-helper" className={`${styles.dropdownItem} ${styles.highlighted}`}>
            <UserCircle2 size={18} />
            <span>Why become a Helper?</span>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default TaskerDropdown;
