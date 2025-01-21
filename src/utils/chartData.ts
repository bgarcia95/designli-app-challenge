export const generateChartData = (data: any) => {
  return Array.from(
    {length: data?.length},
    (_, i) => ({
      stock: i,
      // change: props.route?.params?.stocks?.[i]?.dp,
      price:
        data?.[i]?.price !== 'N/A'
          ? parseFloat(data?.[i]?.price)
          : 0,
    }),
  );
};
