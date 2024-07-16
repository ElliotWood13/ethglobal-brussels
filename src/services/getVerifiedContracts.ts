export const getVerifiedContracts = async () => {
  const response = await fetch(
    "https://eth-sepolia.blockscout.com/api/v2/smart-contracts",
    {
      method: "GET",
      headers: {
        Authorization: process.env.API_KEY ?? "",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
