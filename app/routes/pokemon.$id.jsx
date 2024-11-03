import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node"

export const loader = async ({ params }) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${params.id}`);
  
  if (!response.ok) {
    throw new Response("Error al obtener los detalles del Pokémon", { status: response.status });
  }
  
  const { name, sprites, height, weight, base_experience } = await response.json();
  
  return json({ 
    name, 
    image: sprites.front_default, 
    height, 
    weight, 
    base_experience 
  });
};

export default function PokemonDetail() {
  const { name, image, height, weight, base_experience } = useLoaderData();
  
  return (
    <div>
      <h1>{name}</h1>
      <img src={image} alt={name} />
      <ul>
        <li>Altura: {height}</li>
        <li>Peso: {weight}</li>
        <li>Experiencia Base: {base_experience}</li>
      </ul>
    </div>
  );
}