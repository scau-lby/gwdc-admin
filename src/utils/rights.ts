import Cookies from "js-cookie";

const RightKey = "gwdc-rights";

export function hasRight(rid) {
  return Cookies.get(RightKey).indexOf(rid) !== -1;
}

export function removeRight() {
  Cookies.remove(RightKey);
  sessionStorage.removeItem(RightKey);
}
