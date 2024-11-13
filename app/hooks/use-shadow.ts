import { useEffect, useState } from "react";

interface Props {
  scrollY: number;
}

export const useShadow = ({ scrollY }: Props = { scrollY: 0 }) => {
  const [isShadow, setIsShadow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > scrollY) {
        setIsShadow(true);
      } else {
        setIsShadow(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollY]);

  return {
    isShadow,
  };
};
