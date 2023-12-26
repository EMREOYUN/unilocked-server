import { tr } from "../services/translator";

export default function error(message: any) {
  return {
    success: false,
    error: message,
  };
}

export function errorTr(message: string) {
  return {
    success: false,
    error: tr(message),
  };
}