import { createContext, ReactNode, useEffect, useRef, useState } from "react";
import Router from "next/router";

// INTERFACE
interface AppContextType {
  allPosts: any;
  setAllPosts: (e) => void;

  allTags: any;
  setAllTags: (e) => void;

  suggestTags: any;
  setSuggestTags: (e) => void;

  searchRef: any;
  setSearchRef: (e) => void;

  shown: any;
  setShown: (e) => void;

  searchBox: (val?: string | string[]) => string;

  query: string;
  setQuery: (e: string | string[]) => void;
}

// APP CONTEXT
export const AppContext = createContext<AppContextType>(null);

// APP PROVIDER
export default function AppProvider({ children }: { children: ReactNode }) {
  const [allPosts, setAllPosts] = useState(null);
  const [allTags, setAllTags] = useState(null);

  const [suggestTags, setSuggestTags] = useState(false);
  const [searchRef, setSearchRef] = useState(useRef(null));
  const [shown, setShown] = useState(allPosts);
  const [query, setQuery] = useState(null);

  function getPostsByText(val) {
    setSuggestTags(false);
    let use = [];

    allPosts.forEach((post) => {
      if (
        post.title.toLowerCase().includes(val) ||
        post.date.toLowerCase().includes(val) ||
        post.desc.toLowerCase().includes(val) ||
        post.content.toLowerCase().includes(val)
      ) {
        use.push(post);
      }
    });

    return [...new Set(use)];
  }

  function getPostsByTag(val) {
    setSuggestTags(true);
    let use = [];

    // all tags lower, no space
    const allTagsLower = allTags.map((item) => {
      return item.toLowerCase().replaceAll(" ", "");
    });

    let validTags = [];
    val
      .slice(4)
      .split(",")
      .map((tag) => {
        return tag.toLowerCase().replaceAll(" ", "");
      })
      .forEach((tag) => {
        if (allTagsLower.includes(tag)) {
          validTags.push(tag);
        }
      });

    validTags.forEach((validTag) => {
      allPosts.forEach((post) => {
        post.tags.forEach((tag) => {
          if (tag.toLowerCase().replaceAll(" ", "") === validTag) {
            use.push(post);
          }
        });
      });
    });

    return [...new Set(use)];
  }

  // if x, sets searchbox val to x
  // returns searchbox val
  function searchBox(val: string) {
    // set url based on text input
    if (val === "") {
      // cleanup
      Router.push("/blog");
    } else {
      Router.push(`/blog?search=${val}`);
    }

    const valLower = val.toString();

    // with tag prefix (tag:)
    if (valLower.startsWith("tag:")) {
      setShown(getPostsByTag(valLower));
    } else {
      setShown(getPostsByText(valLower));
    }

    // set inputbox, set focus
    if (searchRef === null || searchRef.current === null) return val;

    searchRef.current.value = val;
    searchRef.current.focus();
    return val;
  }

  return (
    <AppContext.Provider
      value={{
        allPosts,
        setAllPosts,

        allTags,
        setAllTags,

        suggestTags: suggestTags,
        setSuggestTags: setSuggestTags,

        searchRef,
        setSearchRef,

        shown,
        setShown,

        searchBox,

        query,
        setQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}