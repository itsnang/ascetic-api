const isArrayWithObjects = (value: any): boolean => {
  return (
    value instanceof Array &&
    value.every((item) => typeof item === "object" && item !== null)
  );
};

export default isArrayWithObjects;
