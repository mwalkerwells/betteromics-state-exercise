export type Items<T> = Array<T>;
export type Groups<T> = Array<Items<T>>;
export type ItemLocation = [number, number];

import { replaceInArray, deleteInArray, insertInArray } from "./utils";

type Params<T> = [Groups<T>, (groups: Groups<T>) => void];

// ——— Initial State ———
//
// [
//   [ itemIndex (0), itemIndex (1)],                 // groupIndex (0)
//   [],                                              // groupIndex (1)
//   [ itemIndex (2), itemIndex (3), itemIndex (4)],  // groupIndex (2)
// ]

export function useGroups<T>([groups, setGroups]: Params<T>) {
  function deleteItem([groupIndex, itemIndex]: ItemLocation): void {
    const destinationGroup = groups[groupIndex];
    setGroups(
      replaceInArray({
        array: groups,
        index: groupIndex,
        withItem: deleteInArray(destinationGroup, itemIndex),
      })
    );
  }

  function addGroup(): void {
    setGroups(
      insertInArray({
        array: groups,
        index: groups.length,
        withItem: [],
      })
    );
  }

  function addItem(item: T): void {
    setGroups(
      insertInArray({
        array: groups,
        index: groups.length,
        withItem: [item],
      })
    );
  }

  function moveItem(
    [originGroupIndex, originItemIndex]: ItemLocation,
    [destinationGroupIndex, destinationItemIndex]: ItemLocation
  ): void {
    const originGroup = groups[originGroupIndex];
    const destinationGroup = groups[destinationGroupIndex];
    const insertionItem = originGroup[originItemIndex];

    // cannot move within the same group if you're the only item
    if (
      originGroupIndex === destinationGroupIndex &&
      groups[originGroupIndex].length === 0
    ) {
      setGroups(groups);

      // —— if moving within same group  ——
    } else if (originGroupIndex === destinationGroupIndex) {
      // replace group with new group
      setGroups(
        replaceInArray({
          array: groups,
          index: originGroupIndex,
          // delete dragged item & insert at destination
          withItem: insertInArray({
            array: deleteInArray(originGroup, originItemIndex),
            index: destinationItemIndex,
            withItem: insertionItem,
          }),
        })
      );

      // —— if moving to different group ——
    } else {
      setGroups(
        replaceInArray({
          // remove item from origin group
          array: replaceInArray({
            array: groups,
            index: originGroupIndex,
            withItem: deleteInArray(originGroup, originItemIndex),
          }),
          index: destinationGroupIndex,
          // insert item destination group
          withItem: insertInArray({
            array: destinationGroup,
            index: destinationItemIndex,
            withItem: insertionItem,
          }),
        })
      );
    }
  }
  // prettier-ignore
  return {
    groups,
    itemCount: groups.reduce((acc: number, group: any) => acc + group.length, 0),
    moveItem,
    deleteItem,
    addGroup,
    addItem,
  };
}
