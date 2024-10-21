import { useState, useEffect } from "react";

interface Props {
  mediaQuery: string;
}

export const useMediaQuery = ({ mediaQuery }: Props) => {
  const [value, setValue] = useState(false);

  useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    const result = matchMedia(mediaQuery);
    result.addEventListener("change", onChange);
    setValue(result.matches);

    return () => result.removeEventListener("change", onChange);
  }, [mediaQuery]);

  return value;
};
