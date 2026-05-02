export const GetLabel = (
  array: { label: string; value: number }[],
  value: number,
) => {
  const label = array.filter((item) => item.value === value);

  if (label.length === 0) {
    return "";
  }

  return label[0].label;
};
