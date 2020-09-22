import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch, connectAutoComplete } from "react-instantsearch-dom";
import { useDebounce } from "ahooks";

const AsyncMention = ({ hits, currentRefinement, refine }) => {
  const [query, setQuery] = useState(currentRefinement);
  const debouncedQuery = useDebounce(query);

  useEffect(() => {
    console.log("debouncedQuery", debouncedQuery);
    refine(debouncedQuery);
  }, [debouncedQuery]);

  return (
    <>
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        autoFocus
      />

      {debouncedQuery.length > 0 && (
        <ul>
          {hits.map((hit) => (
            <li key={hit.objectID}>{hit.name}</li>
          ))}
        </ul>
      )}
    </>
  );
};

AsyncMention.propTypes = {
  hits: PropTypes.array,
  refine: PropTypes.func,
};

const ConnectedAsyncMention = connectAutoComplete(AsyncMention);

const searchClient = algoliasearch(
  "latency",
  "6be0576ff61c053d5f9a3225e2a90f76"
);

const App = () => {
  const [isFocused, setIsFocused] = useState(false);
  console.log("isFocused", isFocused);
  if (!isFocused)
    return <input type="search" onFocus={() => setIsFocused(true)} />;

  return (
    <InstantSearch searchClient={searchClient} indexName="actors">
      <ConnectedAsyncMention />
    </InstantSearch>
  );
};

export default App;
