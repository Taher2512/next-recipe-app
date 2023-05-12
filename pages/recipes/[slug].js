import {
  sanityClient,
  urlFor,
  usePreviewSubscription,
  PortableText,
} from "@/lib/sanity";
import { useRouter } from "next/router";
import { useReducer, useState } from "react";

const recipeQuery = `*[_type == "recipe" && slug.current == $slug][0]{
    _id,
    name,
    slug,
    mainImage,
    ingredient[] {
        _key,
        unit,
        wholeNumber,
        fraction,
        ingredient->{
            name
        }
    },
    instructions,
    likes
}`;

export default function OneRecipe({ data, preview }) {
  const [likes, setLikes] = useState(data?.recipe?.likes);

  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  // const { data: recipes } = usePreviewSubscription(recipeQuery, {
  //   params: { slug: data.recipes?.slug.current },
  //   initialData: data,
  //   enabled: preview,
  // });

  const addLike = async () => {
    const res = await fetch("/api/handle-like", {
      method: "POST",
      body: JSON.stringify({ _id: recipe._id }),
    }).catch((err) => console.log(err));

    const data = await res.json();

    setLikes(data.likes);
  };

  const { recipe } = data;
  return (
    <article>
      <h1>{recipe.name}</h1>

      <button onClick={addLike}>{likes} 💖</button>

      <main>
        <img src={urlFor(recipe?.mainImage).url()} alt={recipe?.name} />
        <div>
          <ul>
            {recipe.ingredient?.map((ingredient) => (
              <li key={ingredient._key}>
                {ingredient?.wholeNumber}
                {ingredient?.fraction} {ingredient?.unit}
                <br />
                {ingredient?.ingredient?.name}
              </li>
            ))}
          </ul>
          <PortableText blocks={recipe?.instructions} />
        </div>
      </main>
    </article>
  );
}

export async function getStaticPaths() {
  const paths = await sanityClient.fetch(
    `*[_type == "recipe" && defined(slug.current)]{
            "params": {
                "slug": slug.current
            }
        }`
  );
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const recipe = await sanityClient.fetch(recipeQuery, { slug });
  return { props: { data: { recipe }, preview: true } };
}
