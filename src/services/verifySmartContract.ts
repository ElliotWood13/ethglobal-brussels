export interface FormState {
  contract_address: string;
  contract_name: string;
  compiler_version: string;
  file: FileList;
  license_type: string;
}
export const verifySmartContract = async (formState: FormState) => {
  const { contract_address, compiler_version, file, license_type } = formState;
  const formData = new FormData();
  formData.append("file[0]", file[0], file[0].name);
  formData.append("compiler_version", compiler_version);
  formData.append("license_type", license_type);
  // formData.append("contract_name", "Hello World");
  // formData.append("autodetect_constructor_args", "false");
  // formData.append(
  //   "constructor_args",
  //   "00000000000000000000000000000000000000000000000000000002d2982db3000000000000000000000000bb36c792b9b45aaf8b848a1392b0d6559202729e666f6f0000000000000000000000000000000000000000000000000000000000"
  // );

  try {
    const response = await fetch(
      `https://eth-sepolia.blockscout.com/api/v2/smart-contracts/${contract_address}/verification/via/standard-input`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `Error ${response.status}: ${response.statusText} - ${errorData}`
      );
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.log({ err });
  }
};
