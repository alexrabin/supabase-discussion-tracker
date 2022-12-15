import React from "react";
import styles from "styles/Home.module.css";

const NotFoundPage = () => {
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
          This page doesn't exist. <a href="/">Let's go home</a>
        </p>
      </main>
    </div>
  );
};

export default NotFoundPage;
