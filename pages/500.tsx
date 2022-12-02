import React from "react";
import styles from "../styles/Home.module.css";

const ServerErrorPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          This project follows this{" "}
          <a
            href="https://github.com/supabase/supabase/discussions/6979"
            target={"_blank"}
          >
            Supabase Cascade Delete Discussion
          </a>
        </h1>
        <p className={styles.description}>
          Looks like something went wrong. Come back later...
        </p>
      </main>
    </div>
  );
};

export default ServerErrorPage;
