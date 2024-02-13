const uuidPattern =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
// Function to check if a string matches the UUID pattern
export function isUUID(str: string) {
  return uuidPattern.test(str);
}

export function isValidMatchRequest(str: string) {
  return str.match(/^([\w-]+) (\w+)$/);
}
