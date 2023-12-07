import { tr } from "../services/translator";

export default function success(data: any) {
  return {
    success: true,
    data: data,
  };
}

export function successTr(data: any) {
  return {
    success: true,
    data: tr(data),
  };
}
