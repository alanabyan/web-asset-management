export function getInitial(name: string) {
  const splitName = name.split(" ");

  let initialFinal = "";
  splitName.map((data, index) => {
    const firstChar = data.charAt(0);
    initialFinal += firstChar;
  });

  return initialFinal.slice(0, 2);
}
