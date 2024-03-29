import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Container from "../../components/container";
import Header from "../../components/header";
import PostHeader from "../../components/post-header";
import Layout from "../../components/layout";
import PostTitle from "../../components/post-title";
import Head from "next/head";
import { CMS_NAME } from "../../lib/constants";
import client from "../../tina/__generated__/client";
import { useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { PostQuery } from "../../tina/__generated__/types";
type Props = {
  data: PostQuery;
  variables: {
    relativePath: string;
  };
  query: string;
};

export default function Post({ data, query, variables }: Props) {
  const router = useRouter();
  const {
    data: { post },
  } = useTina({ data, query, variables });

  const title = `${post.title} | Next.js Blog Example with ${CMS_NAME}`;
  if (!router.isFallback && !post) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Layout preview={true}>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article className='mb-32'>
              <Head>
                <title>{title}</title>
                <meta property='og:image' content={post.ogImage.url} />
              </Head>
              <PostHeader
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                author={post.author}
              />
              <TinaMarkdown content={post.body} />
            </article>
          </>
        )}
      </Container>
    </Layout>
  );
}

type Params = {
  params: {
    slug: string;
  };
};

export async function getStaticProps({ params }: Params) {
  const { data, query, variables } = await client.queries.post({
    relativePath: params.slug + ".md",
  });

  return {
    props: {
      data,
      query,
      variables,
    },
  };
}
export async function getStaticPaths() {
  const postsListData = await client.queries.postConnection();

  return {
    paths: postsListData.data.postConnection.edges.map((post) => ({
      params: { slug: post.node._sys.filename },
    })),
    fallback: false,
  };
}
