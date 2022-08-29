type InsertInArrayInput<T> = {
  array: Array<T>;
  index: number;
  withItem: T;
};

export function insertInArray<T>({
  array,
  index,
  withItem,
}: InsertInArrayInput<T>): Array<T> {
  // add item to end
  if (index + 1 > array.length) {
    return [...array, withItem];

    // no reason to insert if array is empty
  } else if (array.length === 0) {
    return [withItem];

    // add item to beginning
  } else if (index === 0) {
    return [withItem, ...array];

    // add to middle
  } else {
    const head = array.slice(0, index);
    const tail = array.slice(index, Infinity);
    return [...head, withItem, ...tail];
  }
}

export function splitArray<T>(
  arr: Array<T>,
  splitIndex: number
): [Array<T>, Array<T>] {
  const head = arr.slice(0, splitIndex);
  const tail = arr.slice(splitIndex + 1, Infinity);
  return [head, tail];
}

type ReplaceInArrayInput<T> = InsertInArrayInput<T>;

export function replaceInArray<T>({
  array,
  index,
  withItem,
}: ReplaceInArrayInput<T>): Array<T> {
  const [head, tail] = splitArray(array, index);
  return [...head, withItem, ...tail];
}

export function deleteInArray<T>(
  array: Array<T>,
  deleteIndex: number
): Array<T> {
  const [head, tail] = splitArray(array, deleteIndex);
  return [...head, ...tail];
}
