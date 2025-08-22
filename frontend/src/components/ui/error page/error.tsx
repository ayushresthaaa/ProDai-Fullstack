import { useEffect } from "react";
import Lottie from "lottie-web";
import styles from "./ErrorPage.module.css"; // create your CSS file
import pageNotFoundAnimation from "./pagenotfound.json"; // your Lottie file

export const ErrorPage = () => {
  useEffect(() => {
    const animation = Lottie.loadAnimation({
      container: document.getElementById("lottie-error")!,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: pageNotFoundAnimation,
    });

    return () => animation.destroy();
  }, []);

  return (
    <>
      <div className={styles.errorContainer}>
        <div id="lottie-error" className={styles.lottie}></div>
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <a href="/" className={styles.homeLink}>
          Go Back Home
        </a>
      </div>
    </>
  );
};
