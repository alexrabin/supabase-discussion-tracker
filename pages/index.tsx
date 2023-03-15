import { graphql } from "@octokit/graphql";
import { GetServerSideProps } from "next";
import Discussion, { NodeData } from "models/Discussion";
import getAllIndexes from "utils/getAllIndexes";
import Head from "next/head";
import styles from "styles/Home.module.css";
import React, { useCallback, useMemo, useState } from "react";
export default function Home({
  totalPluses,
  commentsData,
  error,
}: {
  totalPluses?: number;
  commentsData?: NodeData[];
  error?: any;
}) {
  const [showPanel, setShowPanel] = useState(false);
  const value = useMemo(() => {
    if (!totalPluses) {
      return "";
    }
    if (totalPluses > 1000000000) {
      return totalPluses.toExponential(4);
    }
    return totalPluses.toLocaleString(undefined, {});
  }, []);

  const togglePanel = useCallback(() => {
    setShowPanel((prev) => !prev);
  }, []);
  return (
    <div className={styles.container}>
      <Head>
        <title>Supabase Discussion Upvote Tracker</title>
        <meta
          name="description"
          content="Tracking the number of +1 a supabase discussion has"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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

        {totalPluses ? (
          <>
            <p className={styles.description}>
              Here are the total number of upvotes github users have commented
              together on for this discussion:{" "}
              <code className={styles.code}>{value}</code>
            </p>

            {commentsData && (
              <>
                <button
                  className={
                    styles.accordion + ` ${showPanel ? styles.active : ""}`
                  }
                  onClick={togglePanel}
                  style={{ borderRadius: showPanel ? "" : "5px" }}
                >
                  All Comments
                </button>
                <div
                  className={styles.panel}
                  style={{
                    display: showPanel ? "block" : "none",
                  }}
                >
                  {commentsData.map((node, i) => {
                    return (
                      <React.Fragment key={i}>
                        <p className={styles.comment}>
                          <a href={node.author.url} target="_blank">
                            {node.author.login}
                          </a>
                          : {node.body}
                        </p>
                        <hr />
                      </React.Fragment>
                    );
                  })}
                </div>
              </>
            )}
          </>
        ) : (
          <p className={styles.description}>
            Looks like something went wrong. Submit an issue{" "}
            <a
              href="https://github.com/alexrabin/supabase-discussion-tracker/issues"
              target={"_blank"}
            >
              here
            </a>
            {error && (
              <code className={styles.code}>
                Error: {JSON.stringify(error, null, 2)}
              </code>
            )}
          </p>
        )}
      </main>
      <footer className={styles.footer}>
        <p className={styles.description}>
          Created by{" "}
          <a href="https://alexrabin.com" target={"_blank"}>
            Alex Rabin
          </a>
          . The code for this project is{" "}
          <a
            href="https://github.com/alexrabin/supabase-discussion-tracker"
            target={"_blank"}
          >
            here
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=20, stale-while-revalidate=59"
  );
  const owner = "supabase";
  const repo = "supabase";
  const discussionNumber = "6979";
  const {
    repository: { discussion },
  } = (await graphql(
    `
      {
        repository(owner: "${owner}", name: "${repo}") {
          discussion(number: ${discussionNumber}) {
            title
            createdAt
            # first 100 results
            comments(first: 100) {
              # edges.node is where the actual 'Comment' object is
              edges {
                node {
                  author {
                    login
                    url
                  }
                  body
                }
              }
            }
          }
        }
      }
    `,
    {
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    }
  )) as any;
  const commentsData = (discussion as Discussion).comments.edges.map(
    (a) => a.node
  );
  const comments = commentsData.map((a) => a.body);
  let totalPluses = 0;
  let error = null;
  try {
    for (let index = 0; index < comments.length; index++) {
      const element = comments[index];
      const plusIndexes = getAllIndexes(element, "+");
      let count = 0;
      plusIndexes.forEach((plus) => {
        const line = element.slice(plus);
        const endIndex = line.indexOf(" ");
        const number = line
          .slice(1, endIndex === -1 ? undefined : endIndex)
          .replace(/\D/g, "")
          .replaceAll(" ", "");
        const num = parseInt(number);
        if (!Number.isNaN(num)) {
          count += num;
        }
      });
      if (!Number.isNaN(count)) {
        totalPluses += count;
      }
    }
  } catch (e) {
    error = e;
  }

  return {
    props: {
      error,
      totalPluses,
      commentsData,
    },
  };
};
