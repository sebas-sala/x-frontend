import { useEffect } from "react";
import { useLocation, useNavigate } from "@remix-run/react";

export default function Index() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/home") {
      navigate("/home");
    }
  }, [location.pathname, navigate]);
}
