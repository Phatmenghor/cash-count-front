export function convertDate(dateString: string) {
  const date = new Date(dateString);

  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}
