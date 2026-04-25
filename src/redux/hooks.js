import { useSyncExternalStore } from "react";
import { store } from "@/redux/store";

export const useSelector = (selector) =>
  useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getState())
  );

export const useDispatch = () => store.dispatch;
