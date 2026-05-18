export const GetValue = (
  array: { label: string; value: number }[],
  label: string,
) => {
  const value = array.filter((item) => item.label === label);

  if (value.length === 0) {
    return 0;
  }

  return value[0].value;
};
