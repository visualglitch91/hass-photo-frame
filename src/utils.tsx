import { homeAssistant } from "./config.json";

const { token, server } = homeAssistant;

export default function request<T = any>(
  url: string,
  config: {
    method?: "get" | "post";
    headers?: Record<string, string>;
    body?: any;
  } = {}
) {
  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(config.method || "get", url);
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

    if (config.headers) {
      for (const key in config.headers) {
        xhr.setRequestHeader(key, config?.headers[key]);
      }
    }

    xhr.addEventListener("load", () => {
      const { response, status } = xhr;
      const res = JSON.parse(response);

      if (status >= 200 && status < 400) {
        resolve(res);
      } else {
        reject({ error: res, status });
      }
    });

    if (config.body) {
      xhr.send(JSON.stringify(config.body));
    } else {
      xhr.send();
    }
  });
}

export function hass<T = any>(
  method: "get" | "post",
  path: string,
  body?: any
) {
  return request<T>(`${server}/api/${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
}

export function shuffle<T>(array: T[]) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}
