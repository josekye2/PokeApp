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
    <div className="p-4">
      <h1 className="text-3xl font-bold text-blue-500 mb-4">Pokémon List</h1>
      <ul className="list-none">
        {pokemons.map((pokemon) => (
          <li key={pokemon.name} className="mb-2">
            <Link to={`/pokemon/${pokemon.name}`} className="text-blue-500 hover:underline">
              {pokemon.name}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex gap-2">
        {page > 1 && (
          <Link to={`/?page=${page - 1}`} className="text-blue-500 border border-blue-500 px-4 py-1 rounded hover:bg-blue-500 hover:text-white">
            Anterior
          </Link>
        )}
        <Link to={`/?page=${page + 1}`} className="text-blue-500 border border-blue-500 px-4 py-1 rounded hover:bg-blue-500 hover:text-white">
          Siguiente
        </Link>
      </div>
    </div>
  );
}
