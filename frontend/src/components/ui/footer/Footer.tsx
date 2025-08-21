import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerColumn}>
          <h3>Contact</h3>
          <p>Phone: 9849591020</p>
          <p>Email: ayushrestha2fb5@gmail.com</p>
        </div>
        <div className={styles.footerColumn}>
          <h3>Address</h3>
          <p>Kapan, Budhanilkantha, Nepal</p>
        </div>
        <div className={styles.footerColumn}>
          <h3>Follow</h3>
          <p>Facebook / LinkedIn / GitHub</p>
        </div>
      </div>
      <p className={styles.footerBottom}>
        &copy; {new Date().getFullYear()} Pro Dai. All rights reserved.
      </p>
    </footer>
  );
};
