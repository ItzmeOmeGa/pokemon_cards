import React, { useEffect, useState } from "react";
import { PokemonCards } from "./PokemonCards.jsx";

export const Pokemon = () => {
  const [pokemon, setPokemon] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API = "https://pokeapi.co/api/v2/pokemon?limit=100&offset=0";

  const fetchPokemon = async () => {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error(`Failed to fetch list: ${res.status}`);
      const data = await res.json();

      const detailedPromises = data.results.map(async (cur) => {
        const r = await fetch(cur.url);
        if (!r.ok) throw new Error(`Failed to fetch ${cur.name}: ${r.status}`);
        return r.json();
      });

      const detailedResponses = await Promise.all(detailedPromises);
      setPokemon(detailedResponses);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  const searchData = pokemon.filter((p) =>
    p.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  if (loading) {
    return (
      <div>
        <h1>Loading....</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>{error.message}</h1>
      </div>
    );
  }

  return (
    <>
      <section className="container">
        <header>
          <h1> Lets Catch Pokémon</h1>
        </header>
        <div className="pokemon-search">
          <input
            type="text"
            placeholder="search Pokemon"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <ul className="cards">
            {searchData.map((curPokemon) => {
              return <PokemonCards key={curPokemon.id} pokemonData={curPokemon} />;
            })}
          </ul>
        </div>
      </section>
    </>
  );
};