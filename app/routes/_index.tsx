import { Link, useLoaderData } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/node"

interface Pokemon {
  name: string;
  url: string;
}

interface LoaderData {
  pokemons: Pokemon[];
  page: number;
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = 20;

  const offset = (page - 1) * limit;
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
  
  if (!response.ok) {
    throw new Response("Error al obtener la lista de Pokémon", { status: response.status });
  }
  
  const data = await response.json();
  return json<LoaderData>({ pokemons: data.results, page });
};

export default function Index() {
  const { pokemons, page } = useLoaderData<LoaderData>();

  return (
    <div>
      <h1>Pokémon List</h1>
      <ul>
        {pokemons.map((pokemon) => (
          <li key={pokemon.name}>
            <Link to={`/pokemon/${pokemon.name}`}>{pokemon.name}</Link>
          </li>
        ))}
      </ul>

      <div>
        {page > 1 && <Link to={`/?page=${page - 1}`}>Anterior</Link>}
        <Link to={`/?page=${page + 1}`}>Siguiente</Link>
      </div>
    </div>
  );
}