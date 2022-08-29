# Betteromics State Exercise

**Overview:**

- Declarative style
- Mutations avoided
- Updates are `replaceInArray`, `deleteInArray`, `insertInArray` function compositions
- No 3rd party dependencies
- No React dependency (`useState` or other state update function can be used)
- Can be imported via npm
- Data model: `Array<Array<number>>`

**Frontend:**

```ts
// adapted from: https://csb-intqo.netlify.app/

import React, { useState } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useGroups } from "betteromics";

const createItem = (itemNum) => ({
  id: `item-${itemNum}-${new Date().getTime()}`,
  content: `item ${itemNum}`,
});

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle,
});
const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250,
});

function QuoteApp() {
  // ——— Initial State ———
  //
  // [
  //   [ itemIndex (0), itemIndex (1)],                 // groupIndex (0)
  //   [],                                              // groupIndex (1)
  //   [ itemIndex (2), itemIndex (3), itemIndex (4)],  // groupIndex (2)
  // ]

  // prettier-ignore
  const initialGroups = [
    [ createItem(0), createItem(1) ],
    [],
    [ createItem(2), createItem(3), createItem(4) ],
  ];

  // prettier-ignore
  const {
    groups,
    itemCount,
    moveItem,
    deleteItem,
    addGroup,
    addItem
  } = useGroups(useState(initialGroups));

  function onDragEnd(result) {
    // dropped outside the list
    if (result.destination === null) {
      return;
    }

    const originGroupIndex = parseInt(result.source.droppableId);
    const destinationGroupIndex = parseInt(result.destination.droppableId);

    const originItemIndex = result.source.index;
    const destinationItemIndex = result.destination.index;

    moveItem(
      [originGroupIndex, originItemIndex],
      [destinationGroupIndex, destinationItemIndex]
    );
  }

  return (
    <div>
      This is a UI for drag & drop. You can drag items within and between
      groups, as well as adding/deleting items and groups. <br />
      Goal: design and build a data model for supporting actions from this UI. <br />
      We care about representing the underlying state of the component (eg order
      of items and groups)
      <br />
      We don't care about modeling UI interactions (eg cursor position) <br />
      <br />
      Requirements:
      <br />
      1. For Data Store, use an in-memory data-structure (eg array/list) <br />
      2. It should work independently as an imported package (eg npm package or python
      library) <br />
      3. Do not worry about REST API specifications <br />
      4. It should mirror the UI's capabilities closely (adding/deleting items, adding
      groups, moving items) <br />
      5. Items and groups are ordered <br />
      <br />
      <button
        type="button"
        onClick={() => {
          addGroup();
        }}
        style={{ height: "30px", cursor: "pointer", borderRadius: "4px" }}
      >
        Add new group
      </button>
      <button
        type="button"
        style={{ height: "30px", cursor: "pointer", borderRadius: "4px" }}
        onClick={() => {
          addItem(createItem(itemCount + 1));
        }}
      >
        Add new item
      </button>
      <div style={{ display: "flex" }}>
        <DragDropContext onDragEnd={onDragEnd}>
          {groups.map((el, ind) => {
            return (
              <Droppable key={ind} droppableId={`${ind}`}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                    {...provided.droppableProps}
                  >
                    {el.map((item, index) => {
                      return (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-around",
                                }}
                              >
                                {item.content}
                                <button
                                  type="button"
                                  onClick={() => {
                                    deleteItem([ind, index]);
                                  }}
                                >
                                  delete
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<QuoteApp />, rootElement);
```
