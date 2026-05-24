import { AppHeader } from "@/components/AppHeader";
import { PadsCatalog } from "@/pad/PadsCatalog";

const Pads = () => (
  <div className="flex h-screen flex-col">
    <AppHeader crumb="Pads" />
    <div className="flex-1 overflow-auto">
      <PadsCatalog />
    </div>
  </div>
);

export default Pads;
