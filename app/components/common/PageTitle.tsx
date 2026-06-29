import type { PropsWithChildren } from "react";

export default function PageTitle({ children }: PropsWithChildren) {
  return <h2 className="text-2xl">{children}</h2>;
}
