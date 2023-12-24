// /user/:id
export function buildRoutePath(path) {
  const routeParametesRegex = /:([a-zA-Z]+)/g
  const pathWithParams = path.replaceAll(routeParametesRegex, '(?<$1>[a-z0-9\-_]+)')
  
  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`)

  return pathRegex
}