export const getContractTransactions = async () => {
  const response = await fetch(
    "https://eth-sepolia.blockscout.com/api/v2/transactions",
    {
      method: "GET",
      headers: {
        Authorization: "Bearer 14fa1114-d8bd-4f86-aed1-97179ab50f8d",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
