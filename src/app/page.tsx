"use client";
import { MessageCircleQuestion, Check, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { verifySmartContract } from "@/services/verifySmartContract";
import { InputFile } from "@/components/ui/inputFile";
import { getVerifiedContracts } from "@/services/getVerifiedContracts";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const notifications = [
  {
    title: "HelloWorld.json",
    description: "Verification Successful",
    contract: "0x855e5ab62E7ccdB3784E313df5abc1E1275cE043",
    success: true,
  },
  {
    title: "HelloWorld.json",
    description: "Verification Error",
    contract: undefined,
    success: false,
  },
];

export interface FormState {
  contract_address: string;
  contract_name: string | undefined;
  compiler_version: string;
  file: File | undefined;
  license_type: string;
}

export default function Home() {
  const [switchOn, setSwitchOn] = useState(false);
  const [formState, setFormState] = useState<FormState>({
    contract_address: "",
    contract_name: undefined,
    compiler_version: "",
    file: undefined,
    license_type: "",
  });
  const { toast } = useToast();
  const { mutate: verifyContract, isPending: verifyLoading } = useMutation({
    mutationFn: verifySmartContract,
    onSuccess: (data: any) => {
      console.log("onSuccess", data);
      toast({
        title: "Smart contract verified",
        description: "Your contract was successfully verified",
      });
    },
    onError: (err) => {
      console.log(err);
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Your contract was not able to be verified",
      });
    },
  });
  const { data, error, isLoading } = useQuery({
    queryKey: ["verifiedContracts"],
    queryFn: getVerifiedContracts,
    // refetchInterval: 5000
  });
  const verifiedContracts = data?.items?.slice(0, 4);

  return (
    <main className="p-4 flex justify-center">
      <div className="w-full max-w-6xl gap-4 font-mono text-sm flex justify-center">
        <Card className="w-[50%]">
          <CardHeader>
            <CardTitle>Verified Smart Contracts</CardTitle>
            <CardDescription>Most recent verified contracts </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {isLoading ? (
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-[104px] w-[518px]" />
                <Skeleton className="h-[104px] w-[518px]" />
                <Skeleton className="h-[104px] w-[518px]" />
                <Skeleton className="h-[104px] w-[518px]" />
              </div>
            ) : (
              <>
                {verifiedContracts?.map((contract: any, index: number) => {
                  const date = new Date(contract?.verified_at);
                  const newDate = date.toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  });

                  return (
                    <a
                      key={index}
                      href={`https://eth.blockscout.com/address/${contract?.address?.hash}`}
                      target="_blank"
                      className="flex gap-2 flex-col rounded-md border p-4 hover:border-cyan-500"
                    >
                      <div className="flex items-center wrap gap-1">
                        <p className="text-sm font-medium leading-none">
                          Hash:
                        </p>
                        <p className="text-sm leading-none text-muted-foreground">
                          {contract?.address?.hash}
                        </p>
                      </div>
                      <div className="flex items-center wrap gap-1">
                        <p className="text-sm font-medium">Language:</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {contract?.language}
                        </p>
                      </div>
                      <div className="flex items-center wrap gap-1">
                        <p className="text-sm font-medium">Verified:</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {newDate}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </>
            )}
          </CardContent>
        </Card>
        <Card className="w-[50%] bg-gray-50">
          <CardHeader>
            <CardTitle>Verify Smart Contract</CardTitle>
            <CardDescription>Add your JSON below and verify</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className=" flex items-center space-x-4 rounded-md border p-4">
              <MessageCircleQuestion />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Don't have a contract but want to try it out?
                </p>
                <p className="text-sm text-muted-foreground">
                  Use test contract
                </p>
              </div>
              <Switch
                checked={switchOn}
                onCheckedChange={async () => {
                  setSwitchOn(!switchOn);
                  setFormState({
                    contract_address: switchOn
                      ? ""
                      : "0x855e5ab62E7ccdB3784E313df5abc1E1275cE043",
                    contract_name: undefined,
                    compiler_version: switchOn ? "" : "v0.8.26+commit.8a97fa7a",
                    file: undefined,
                    license_type: switchOn ? "" : "unlicense",
                  });
                }}
              />
            </div>
            <div className="py-4">
              {notifications.map((notification, index) => (
                <a
                  key={index}
                  href={
                    notification?.contract
                      ? `https://eth-sepolia.blockscout.com/address/${notification.contract}`
                      : "#"
                  }
                  target="_blank"
                  className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                >
                  <span
                    className={`flex h-2 w-2 translate-y-1 rounded-full ${
                      notification.success ? "bg-emerald-400" : "bg-rose-600"
                    }`}
                  />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {notification.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {notification.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>
            <form className="flex flex-col gap-2">
              <Input
                type="text"
                placeholder="Contract Address"
                value={formState.contract_address}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    contract_address: e.target.value,
                  })
                }
              />
              <Select
                value={formState.license_type}
                onValueChange={(val) =>
                  setFormState({
                    ...formState,
                    license_type: val,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a contract license" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="unlicense">Unlicense</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select
                value={formState.compiler_version}
                onValueChange={(val) =>
                  setFormState({
                    ...formState,
                    compiler_version: val,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a compiler version" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="v0.8.26+commit.8a97fa7a">
                      v0.8.26+commit.8a97fa7a
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {switchOn ? (
                <div className="px-3">
                  <Label>HelloWorld2.json</Label>
                </div>
              ) : (
                <InputFile
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    console.log({
                      e: e,
                      etar: e.target,
                      etarfil: e.target?.files,
                    });
                    setFormState({
                      ...formState,
                      file: e?.target?.files?.[0],
                    });
                  }}
                />
              )}
            </form>
          </CardContent>
          <CardFooter className="self-end">
            <Button
              disabled={verifyLoading}
              type="submit"
              className="w-full"
              onClick={() => verifyContract(formState)}
            >
              {verifyLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}{" "}
              Verify Smart Contract
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
