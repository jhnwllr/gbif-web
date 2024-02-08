import { jsx, css } from '@emotion/react'
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import * as charts from '../../../../widgets/dashboard';
import { Resizable } from 're-resizable';
import Map from "../Map";
import { MdAddChart, MdClose, MdDragHandle, MdShare } from "react-icons/md";

import Table from '../Table';
import Gallery from '../Gallery';
import { uncontrollable } from 'uncontrollable';
import { Button } from '../../../../components';
import { Card, CardTitle } from '../../../../widgets/dashboard/shared';
import { button as buttonStyle, primary as primaryButtonStyle } from '../../../../components/Button/Button.styles';
import useBelow from '../../../../utils/useBelow';

const chartsTypes = {
  Iucn: {
    type: ({ predicate, ...props }) => {
      return <charts.Iucn predicate={predicate} interactive {...props} />
    },
  },
  Synonyms: {
    type: ({ predicate, ...props }) => {
      return <charts.Synonyms predicate={predicate} interactive {...props} />
    },
  },
  IucnCounts: {
    type: ({ predicate, ...props }) => {
      return <charts.IucnCounts predicate={predicate} interactive {...props} />
    },
  },
  Country: {
    type: ({ predicate, ...props }) => {
      return <charts.Country predicate={predicate} interactive {...props} />
    },
  },
  CollectionCodes: {
    type: ({ predicate, ...props }) => {
      return <charts.CollectionCodes predicate={predicate} interactive {...props} />
    },
  },
  InstitutionCodes: {
    type: ({ predicate, ...props }) => {
      return <charts.InstitutionCodes predicate={predicate} interactive {...props} />
    },
  },
  StateProvince: {
    type: ({ predicate, ...props }) => {
      return <charts.StateProvince predicate={predicate} interactive {...props} />
    },
  },
  IdentifiedBy: {
    type: ({ predicate, ...props }) => {
      return <charts.IdentifiedBy predicate={predicate} interactive {...props} />
    },
  },
  RecordedBy: {
    type: ({ predicate, ...props }) => {
      return <charts.RecordedBy predicate={predicate} interactive {...props} />
    },
  },
  EstablishmentMeans: {
    type: ({ predicate, ...props }) => {
      return <charts.EstablishmentMeans predicate={predicate} interactive defaultOption="PIE" {...props} />
    },
  },
  Months: {
    type: ({ predicate, ...props }) => {
      return <charts.Months predicate={predicate} interactive defaultOption="PIE" {...props} />
    },
  },
  Preparations: {
    type: ({ predicate, ...props }) => {
      return <charts.Preparations predicate={predicate} defaultOption="PIE" {...props} />
    },
  },
  Datasets: {
    type: ({ predicate, ...props }) => {
      return <charts.Datasets predicate={predicate} interactive {...props} />
    },
  },
  Taxa: {
    type: ({ predicate, ...props }) => {
      return <charts.Taxa predicate={predicate} interactive {...props} />
    },
  },
  OccurrenceIssue: {
    type: ({ predicate, ...props }) => {
      return <charts.OccurrenceIssue predicate={predicate} interactive {...props} />
    },
  },
  Map: {
    r: true,// resizable
    type: ({ predicate, ...props }) => {
      return <Map predicate={predicate} interactive style={{
        background: 'white',
        paddingTop: 8,
        border: '1px solid var(--paperBorderColor)',
        borderRadius: 'var(--borderRadiusPx)'
      }} mapProps={{ style: { border: 0, borderRadius: '0 0 var(--borderRadiusPx) var(--borderRadiusPx)' } }} {...props}
      />
    },
  },
  Table: {
    r: true,// resizable
    type: ({ predicate, ...props }) => {
      return <Table predicate={predicate} interactive {...props} style={{
        background: 'white',
        paddingTop: 8,
        border: '1px solid var(--paperBorderColor)',
        borderRadius: 'var(--borderRadiusPx)'
      }} dataTableProps={{ style: { borderWidth: '1px 0 0 0' } }} />
    },
  },
  Gallery: {
    r: true,// resizable
    type: ({ predicate, ...props }) => {
      return <Gallery predicate={predicate} size={10} interactive style={{
        overflow: 'auto',
        height: '100%',
        background: 'white',
        paddingTop: 8,
        border: '1px solid var(--paperBorderColor)',
        borderRadius: 'var(--borderRadiusPx)'
      }} {...props} />
    },
  },
}

function generateRandomId() {
  return Math.random().toString(36).substring(2, 7);
}

const getItem = (type) => {
  const chart = chartsTypes[type];
  if (!chart) return;
  const id = generateRandomId();
  return {
    id,
    p: {},
    ...chart,
    t: type
  }
}

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};
const grid = 8;

const getItemStyle = (isDragging, draggableStyle, index) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  margin: `0 0 ${grid * 2}px 0`,
  position: 'relative',
  zindex: 1,
  outlineStyle: isDragging ? 'auto' : '',
  outlineColor: isDragging ? 'deepskyblue' : '',

  // change background colour if dragging
  // background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = ({ isDraggingOver, width, index, maxGroups, groupCount }) => {
  const cardSize = 600;
  const firstItemWidth = `calc(100% - ${cardSize * (groupCount - 1)}px - ${grid * (groupCount - 1)}px)`;
  const style = index === 0 ? {
    flex: `1 1 400px`,
    width: '33%',//`calc(100% - ${cardSize * (groupCount - 1)}px - ${grid * (groupCount - 1)}px)`,
  } : {
    flex: `0 0 600px`,
    maxWidth: `${width}%`,
  }
  return {
    background: isDraggingOver ? "#00000005" : "none",
    padding: `0 ${grid}px`,
    marginBottom: 12,
    ...style
  }
};

function DashboardBuilder({ predicate, state = [[]], setState, isUrlLayoutDifferent, lockedLayout, ...props }) {
  const [isDragging, setIsDragging] = useState(false);
  const isBelow800 = useBelow(1100);
  const isBelow1200 = useBelow(1600);
  const isBelow1800 = useBelow(2100);

  const deviceSize = isBelow800 ? 'small' : isBelow1200 ? 'medium' : isBelow1800 ? 'large' : 'xlarge';
  const maxGroups = deviceSize === 'small' ? 1 : deviceSize === 'medium' ? 2 : deviceSize === 'large' ? 3 : 4;
  const disableAdd = maxGroups < state.length;


  //Before doing anything ensure that the state is valid and all items have a unique id
  useEffect(() => {
    // check all items have unique ids
    const ids = state.map(group => group.map(item => item.id)).flat();
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      alert('duplicate ids found in the state');
      setState([[]]);
      return;
    }
  }, []);

  // if max groups exceeded, then remove empty groups automatically
  useEffect(() => {
    if (maxGroups < state.length) {
      // only update state if there is empty groups
      if (state.filter(group => group.length === 0).length > 0) {
        setState(state.filter(group => group.length));
      }
    }
  }, [maxGroups, state, setState]);

  // if an invalid state is passed, reset to default
  if (!Array.isArray(state) || state.length === 0) {
    setState([[]]);
    return null;
  }

  const onDragStart = () => {
    setIsDragging(true);
  };

  function onDragEnd(result) {
    setIsDragging(false);
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState[sInd] = items;
      setState(newState);
    } else {
      const result = move(state[sInd], state[dInd], source, destination);
      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setState(newState);
      // setState(newState.filter(group => group.length));
    }
  }

  // add function to update individual item in the state
  function updateItemProps({ groupIndex, itemIndex, item }) {
    const newState = [...state];
    newState[groupIndex][itemIndex] = item;
    setState(newState);
  }

  function addNewGroup() {
    if (state.length > 3) {
      console.warn('max 4 groups allowed');
      return;
    }
    setState([...state, []]);
  }

  function removeColumn(index) {
    const newState = [...state];
    newState.splice(index, 1);
    setState(newState);
  }

  function restructureToFitDevice() {
    if (maxGroups >= state.length) return;
    const newState = [...state]
    // Get the total number of columns before removal
    const totalColumns = newState.length;
    if (maxGroups < 1 || maxGroups > totalColumns) {
      return newState;
    }

    const columnsToRemove = totalColumns - maxGroups;

    // Remove the last x columns and store them
    const removedColumns = newState.splice(totalColumns - columnsToRemove, columnsToRemove);

    // Flatten the array of removed columns
    const flattenedRemovedColumns = removedColumns.flat();

    // Distribute the items from removed columns into remaining columns
    for (let i = 0; i < flattenedRemovedColumns.length; i++) {
      const columnIndex = i % maxGroups;
      newState[columnIndex].push(flattenedRemovedColumns[i]);
    }

    setState(newState);
  }

  return (
    <div>
      {disableAdd && <div style={{ padding: 12, }}>
        The layout does not fit the current size.
        <Button style={{ fontSize: '0.85em' }} onClick={restructureToFitDevice}>Fit to device</Button>
      </div>}
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex", flexWrap: disableAdd ? 'wrap' : 'wrap', margin: `0 ${-grid}px`, flex: '1 1 auto' }}>
          <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
            {state.map((column, ind) => (
              // For each group create a column
              <Droppable key={ind} droppableId={`${ind}`}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={getListStyle({
                      isDraggingOver: snapshot.isDraggingOver,
                      width: 100 / Math.min(maxGroups, state.length),
                      maxGroups,
                      groupCount: state.length,
                      index: ind,
                      deviceSize
                    })}
                    {...provided.droppableProps}
                  >
                    <Column {...{
                      lockedLayout,
                      predicate,
                      isDragging,
                      disableAdd,
                      addNewGroup,
                    }} items={column} onDelete={({ index }) => {
                      const newState = [...state];
                      newState[ind].splice(index, 1);
                      setState(
                        // newState.filter(group => group.length)
                        newState
                      );
                    }}
                      removeColumn={() => removeColumn(ind)}
                      columnCount={state.length}
                      isLastGroup={ind === state.length - 1}
                      onAdd={(type) => {
                        // add new item to this group
                        const newState = [...state];
                        if (getItem(type)) {
                          newState[ind].push(getItem(type));
                          setState(newState);
                        } else {
                          console.warn('type not found', type);
                        }
                      }}
                      onUpdateItem={(item, index) => updateItemProps({ groupIndex: ind, itemIndex: index, item })} />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </DragDropContext>
        </div>
        <div>
          <div css={css`flex: 0 0 auto; position: sticky; top: 0; display: flex; flex-direction: column; margin-inline-start: ${grid * 2}px;`}>
            <Button style={{ marginBottom: 8 }} onClick={() => {
              // first we need to decide what to share. to get that we set the 
              setState(state, true);
              // after 200ms copy the current url to the clipboard
              setTimeout(() => {
                navigator.clipboard.writeText(window.location.href)
              }, 200);
            }}><MdShare /></Button>
            {maxGroups > state.length && <Button onClick={addNewGroup}><MdAddChart /></Button>}
          </div>
        </div>
      </div>
    </div>
  );
}


function Column({ items: el, lockedLayout, onDelete, onAdd, onUpdateItem, isDragging, predicate, isLastGroup, disableAdd, addNewGroup, removeColumn, columnCount }) {
  return <>{el.map((item, index) => (
    <Item {...{
      lockedLayout,
      predicate,
      item,
      index,
      onDelete,
      onUpdateItem
    }} key={item.id} />
  ))}

    <div style={{ visibility: (isDragging || lockedLayout) ? 'hidden' : 'visible' }}>
      {el.length === 0 && <EmptyColumn {...{ onAdd, isLastGroup, addNewGroup, removeColumn, columnCount }} />}
      {(el.length > 0 && !disableAdd) && <ColumnOptions {...{ onAdd, isLastGroup, addNewGroup, removeColumn, columnCount }} />}
    </div>
  </>
}

function Item({ item, index, onDelete, onUpdateItem, predicate, lockedLayout }) {
  const { t: type, r: resizable = false, p: params = {} } = item;
  const { h: height = 500, ...componentProps } = params;
  const Component = chartsTypes[type]?.type ?? (() => <div>not defined</div>);
  const content = <Component predicate={predicate} {...componentProps} setView={view => onUpdateItem({ ...item, p: { view } }, index)} />

  const canBeResized = resizable && !lockedLayout;
  return <Draggable
    key={item.id}
    draggableId={item.id}
    index={index}
  >
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        style={getItemStyle(
          snapshot.isDragging,
          provided.draggableProps.style,
          item.index
        )}
      >
        {/* Custom Drag Handle (Corner) */}
        {!lockedLayout && <div
          css={css`
          width: 24px;
          height: 48px;
          position: absolute;
          top: 12px;
          right: -12px;
          z-index: 10;
          border-radius: 12px;
          background: white;
          border: 1px solid #ddd;
          color: #aaa;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          `}
        >
          <div {...provided.dragHandleProps}><MdDragHandle /></div>
          <MdClose onClick={() => onDelete({ index })} />
        </div>}
        {!resizable && content}
        {resizable && <Resizable
          enable={canBeResized && { top: false, right: false, bottom: true, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
          size={{
            height,
          }}
          onResizeStop={(e, direction, ref, d) => {
            onUpdateItem({ ...item, p: { ...params, h: height + d.height } }, index);
          }}
        >
          {content}
        </Resizable>}
      </div>
    )}
  </Draggable>
}

function EmptyColumn({ onAdd, isLastGroup, addNewGroup, removeColumn, columnCount }) {
  // if the columns is empty, then show a larger card with a placeholder graph and provide the user 3 options: add chart, delete column or add additional column.
  return <Card>
    <CardTitle></CardTitle>
    <div style={{ textAlign: 'center' }}>
      <MdAddChart style={{ fontSize: 100, color: 'var(--color200)' }} />
      <ColumnOptions {...{ onAdd, isLastGroup, addNewGroup, removeColumn, columnCount, isEmpty: true }} />
    </div>
  </Card>

}

function ColumnOptions({ onAdd, isLastGroup, addNewGroup, removeColumn, columnCount, isEmpty }) {
  return (
    <div css={css`
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      > * {
        margin: 0 4px;
      }
    `}>
      <CreateOptions onAdd={onAdd} />
      {isEmpty && <Button look="primaryOutline" onClick={removeColumn}>Remove empty card</Button>}
      {/* {isLastGroup && <Button look="primaryOutline" onClick={addNewGroup}>Add column</Button>} */}
    </div>
  );
}

function CreateOptions({ onAdd }) {
  const [selectedOption, setSelectedOption] = useState('');

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === '') return;
    onAdd(selectedValue);
  };

  return <select value={selectedOption} onChange={handleSelectChange} css={css`${buttonStyle}; ${primaryButtonStyle}; max-width: 100px; font-size: 12px;`}>
    <option value="">Add chart</option>
    {Object.keys(chartsTypes).map(type => <option value={type} key={type}>{type}</option>)}
  </select>
};

// export default DashboardBuilder;

export default uncontrollable(DashboardBuilder, {
  state: 'setState'
});