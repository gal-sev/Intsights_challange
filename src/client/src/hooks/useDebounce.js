import { useEffect, useState } from "react";

export function useDebounce(value, delay) {
  const [debouncedVal, setDebouncedVal] = useState(value);

  //Reset the timeout every update
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedVal(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedVal;
}

export default useDebounce;
