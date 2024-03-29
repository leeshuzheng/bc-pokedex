import { useState, useRef } from "react";
import { Outlet } from "react-router-dom";
import {
  Container,
  Header,
  Main,
  HeaderLink,
  Clone,
  Row,
  SearchInput,
  PokeballImg,
  SuggestionsList,
  SuggestionsLink,
  // AddPokemonBtn,
  ActionsAside,
  // PageLink,
} from "./style";
import { useLazyQuery } from "@apollo/client";
import { debounce } from "lodash";
import { useOutsideAlerter } from "@hooks/useOutsideAlerter";
import getPokemonBySearchTerm from "@graphql/queries/getPokemonBySearchTerm";
import AddPokemonFormModal from "@components/AddPokemonFormModal";

const Layout = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [isAddPokemonOpen, setIsAddPokemonOpen] = useState<boolean>(false);
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, () => setSearchValue(""));

  const [search, { data }] = useLazyQuery(getPokemonBySearchTerm, {
    variables: {
      searchValue,
    },
  });

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(e.target.value);
    debouncedSearch();
  }

  const debouncedSearch = useRef(
    debounce(() => {
      search();
    }, 500)
  ).current;

  return (
    <>
      <AddPokemonFormModal
        isOpen={isAddPokemonOpen}
        closeModal={() => setIsAddPokemonOpen(false)}
      />
      <Header>
        <Container>
          <Row>
            <HeaderLink to="/">
              <PokeballImg
                alt="pokeball"
                src={
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/512px-Pok%C3%A9_Ball_icon.svg.png"
                }
              />
              <h1>
                pokédex<Clone>.clone</Clone>
              </h1>
            </HeaderLink>
            <ActionsAside>
              {/* <PageLink to="/pokefriends">PokéFriends</PageLink> */}
              {/* <AddPokemonBtn onClick={() => setIsAddPokemonOpen(true)}>
                Add PokéFriend
              </AddPokemonBtn> */}
              <SearchInput>
                <svg height="19" viewBox="0 0 18 19" width="18">
                  <path
                    d="m559.179993 45.9010802c0-3.4003115-2.373108-5.56108-5.564608-5.56108-3.191501 0-5.565397 2.1674824-5.565397 5.56108 0 3.3935975 2.090012 5.568921 5.565397 5.568921s5.564608-2.1686096 5.564608-5.568921zm4.820007 9c0 .7572115-.627404 1.3846154-1.384615 1.3846154-.367789 0-.72476-.1514424-.973558-.4110577l-3.710337-3.6995193c-1.265625.876202-2.780048 1.3413462-4.316105 1.3413462-4.207933 0-7.615385-3.4074519-7.615385-7.6153846s3.407452-7.6153846 7.615385-7.6153846c4.207932 0 7.615384 3.4074519 7.615384 7.6153846 0 1.5360577-.465144 3.0504807-1.341346 4.3161057l3.710337 3.7103366c.248798.2487981.40024.6057692.40024.9735577z"
                    fill="currentColor"
                    fillRule="evenodd"
                    transform="translate(-546 -38)"
                  ></path>
                </svg>
                <input
                  type="text"
                  placeholder="Search for a pokémon"
                  onChange={handleChange}
                />
                {searchValue.length >= 2 && (
                  <SuggestionsList ref={wrapperRef}>
                    {data?.pokemon?.slice(0, 5)?.map(
                      (
                        pokemon: {
                          name: string;
                          id: number;
                        },
                        i: number
                      ) => (
                        <li key={i}>
                          <SuggestionsLink
                            onClick={() => setSearchValue("")}
                            to={`/pokemon/${pokemon.name}/${pokemon.id}`}
                          >
                            {pokemon.name}
                          </SuggestionsLink>
                        </li>
                      )
                    )}
                  </SuggestionsList>
                )}
              </SearchInput>
            </ActionsAside>
          </Row>
        </Container>
      </Header>
      <Main>
        <Container>
          <Outlet />
        </Container>
      </Main>
    </>
  );
};

export default Layout;
