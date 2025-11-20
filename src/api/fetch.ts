import type {AfterFetchContext, BeforeFetchContext} from '@vueuse/core';
import {createFetch} from '@vueuse/core';

function beforeFetch({options}: BeforeFetchContext) {
  return {options};
}

function afterFetch(ctx: AfterFetchContext) {
  const {data, response} = ctx;
  if (response.ok) {
    if (data.statusCode !== 0) {
      throw new Error(data.msg);
    }
  }
  return ctx;
}

const fetch_ = createFetch({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  options: {
    immediate: true,
    refetch: false,
    timeout: 10 * 60 * 10000,
    beforeFetch,
    afterFetch,
  },
});

const methods = [
  'get',
  'post',
  'put',
  'delete',
  'patch',
  'head',
  'options',
] as const;

type Methods = (typeof methods)[number];

type HandleMethods = 'json' | 'text' | 'blob' | 'formData' | 'arrayBuffer';

type Api = Record<Methods, ReturnType<typeof getRequestFn>>;

function getRequestFn(method: Methods) {
  return async <T = any>(
    url: string,
    options: {
      searchParams?: Record<string, any>;
      body?: FormData | URLSearchParams | Record<string, any> | string | Blob;
      handleMethod?: HandleMethods;
    } = {},
  ) => {
    const {searchParams, handleMethod = 'json'} = options;
    let {body} = options;
    const fetchOptions: RequestInit = {};
    if (searchParams) {
      const params = new URLSearchParams(searchParams);
      const keys = [...params.keys()];
      for (const key of keys) {
        const value = params.get(key);
        if (!value) {
          params.delete(key);
        }
      }
      const search = params.toString();
      if (search) {
        url += `?${search}`;
      }
    }
    if (body) {
      if (body instanceof URLSearchParams) {
        fetchOptions.headers = {
          'Content-Type': 'application/x-www-form-urlencoded',
        };
      } else if (body instanceof Blob) { // File 也是 Blob
        // 让浏览器自动决定 Content-Type; 若没有类型则指定 application/octet-stream
        if (!body.type) {
          fetchOptions.headers = {
            'Content-Type': 'application/octet-stream',
          };
        }
      } else if (typeof body === 'object') {
        fetchOptions.headers = {
          'Content-Type': 'application/json',
        };
        body = JSON.stringify(body);
      }
      fetchOptions.body = body;
    }
    const {data, error} = await fetch_(url, {
      method,
      ...fetchOptions,
    })[handleMethod]();
    if (error.value)
      return {err: error.value};
    return {res: data.value as T};
  };
}

const api = Object.create(null) as Api;

methods.forEach((method) => {
  api[method] = getRequestFn(method);
});

export default api;
