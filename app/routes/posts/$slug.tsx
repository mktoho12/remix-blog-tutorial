import { marked } from "marked"
import type { LoaderFunction } from "@remix-run/server-runtime";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";

import type { Post } from "~/models/posts.server";
import { getPost } from "~/models/posts.server";
import invariant from "tiny-invariant";

type LoaderData = { post: Post, html: string };

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, `params.slug is required`);

  const post = await getPost(params.slug);
  invariant(post, `Post not found ${params.slug}`);

  const html = marked(post.markdown)

  return json<LoaderData>({ post, html });
};

export default function PostSlug() {
  const { post, html } = useLoaderData<LoaderData>();

  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="my-6 border-b-2 text-center text-3xl">{post.title}</h1>
      <div dangerouslySetInnerHTML={{__html: html}}/>
    </main>
  );
}
