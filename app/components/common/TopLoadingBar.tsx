import { useEffect, useRef } from "react";
import { useNavigation } from "react-router";
import LoadingBar from "react-top-loading-bar";

export default function TopLoadingBar() {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);

  const loaderBarRef = useRef<any>(null);

  useEffect(() => {
    if (isNavigating) {
      loaderBarRef.current?.continuousStart();
    } else {
      loaderBarRef.current?.complete();
    }
  }, [isNavigating]);

  return <LoadingBar color={"#4f39f6"} ref={loaderBarRef} />;
}
