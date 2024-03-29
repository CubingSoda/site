import Meta from "components/Meta";

import Nav from "./NavBar";
import Footer from "./Footer";

import styles from "styles/UI.module.scss";

interface UIProps {
  children: React.ReactNode;
  page?: string;
  desc?: string;
  keywords?: string[];
}

const UI: React.FC<UIProps> = ({ children, page, desc, keywords }) => {
  return (
    <main className={styles.UI}>
      <Meta page={page} desc={desc} keywords={keywords} />

      <a className={styles.skipNavLink} href="#main-content">
        Skip Navigation
      </a>

      <Nav />

      <main id="main-content" className={styles.main} tabIndex={-1}>
        {children}
        <Footer />
      </main>
    </main>
  );
};

export default UI;
