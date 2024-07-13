import { dummyContractHash } from "../data/dummyContractHash";
import dummyContract from "../data/dummyContract.json";
import { FormState } from "@/app/page";

export const verifySmartContract = async (formState: FormState) => {
  console.log({ formState });
  const response = await fetch(
    `https://eth-sepolia.blockscout.com/api/v2/smart-contracts/${formState.contract_address}/verification/via/standard-input`,
    {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formState,
    }
  );
  const data = await response.json();

  return data;
};
