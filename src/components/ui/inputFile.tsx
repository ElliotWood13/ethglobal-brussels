import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InputFile({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: any;
}) {
  return (
    <div className="grid w-full items-center">
      <Label htmlFor="file"></Label>
      <Input id="file" type="file" value={value} onChange={onChange} />
    </div>
  );
}
