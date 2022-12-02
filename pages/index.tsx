import { graphql } from "@octokit/graphql";
import { GetServerSideProps } from "next";
import Discussion from "../models/Discussion";
import getAllIndexes from "../utils/getAllIndexes";
import Head from "next/head";
import styles from "../styles/Home.module.css";
export default function Home({ totalPluses }: { totalPluses: number }) {
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

        <p className={styles.description}>
          Here are the total number of upvotes, github users have commented
          together on:{" "}
          <code className={styles.code}>
            {totalPluses.toLocaleString(undefined, {})}
          </code>
        </p>
        <p className={styles.description}>
          Created by{" "}
          <a href="https://alexrabin.com" target={"_blank"}>
            Alex Rabin
          </a>
          . The Code for this project is{" "}
          <a
            href="https://github.com/alexrabin/supabase-discussion-tracker"
            target={"_blank"}
          >
            here
          </a>
          .
        </p>
      </main>
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
            # first 10 results
            comments(first: 100) {
              # edges.node is where the actual 'Comment' object is
              edges {
                node {
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

  const comments = (discussion as Discussion).comments.edges.map(
    (a) => a.node.body
  );
  let totalPluses = 0;
  let error;
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
        count += parseInt(number);
      });
      totalPluses += count;
    }
  } catch (e) {
    error = e;
  }

  return {
    props: {
      totalPluses,
    },
  };
};
