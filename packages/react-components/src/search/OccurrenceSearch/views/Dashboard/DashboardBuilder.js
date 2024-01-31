import { jsx, css } from '@emotion/react'
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import * as charts from '../../../../widgets/dashboard';
import { Resizable } from 're-resizable';
import Map from "../Map";
import { MdClose, MdDragHandle } from "react-icons/md";
import Table from '../Table';
import Gallery from '../Gallery';
import { uncontrollable } from 'uncontrollable';

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
      return <charts.EstablishmentMeans predicate={predicate} interactive {...props} />
    },
  },
  Months: {
    type: ({ predicate, ...props }) => {
      return <charts.Months predicate={predicate} interactive {...props} />
    },
  },
  Preparations: {
    type: ({ predicate, ...props }) => {
      return <charts.Preparations predicate={predicate} interactive {...props} />
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
      }} mapProps={{style: {border: 0, borderRadius: '0 0 var(--borderRadiusPx) var(--borderRadiusPx)'}}} {...props} 
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
      }} dataTableProps={{style: {borderWidth: '1px 0 0 0'}}}/>
    },
  },
  Gallery: {
    r: true,// resizable
    type: ({ predicate, ...props }) => {
      return <Gallery predicate={predicate} size={10} interactive style={{
        overflow :'auto', height: '100%', background: 'white',
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
const getListStyle = ({ isDraggingOver, width, index }) => {
  const style = index === 0 ? {
    flex: '10 0 auto',
    width: '550px',
    maxWidth: '100%',
  } : {
    flex: '1 1 550px'
  }
  return {
    background: isDraggingOver ? "#00000005" : "none",
    padding: `${grid * 2}px ${grid}px`,
    ...style
  }
};

function DashboardBuilder({ predicate, state, setState, ...props }) {
  const [isDragging, setIsDragging] = useState(false);

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

  return (
    <div>
      {/* <button
        type="button"
        onClick={() => {
          setState([...state, []]);
        }}
      >
        Add new group
      </button>
      <button
        type="button"
        onClick={() => {
          setState([...state, getItem('months')]);
        }}
      >
        Add new item
      </button> */}
      <div style={{ display: "flex", flexWrap: 'wrap' }}>
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          {state.map((column, ind) => (
            // For each group create a column
            <Droppable key={ind} droppableId={`${ind}`}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle({
                    isDraggingOver: snapshot.isDraggingOver,
                    width: (100 / state.length),
                    index: ind
                  })}
                  {...provided.droppableProps}
                >
                  <Column predicate={predicate} isDragging={isDragging} items={column} onDelete={({ index }) => {
                    const newState = [...state];
                    newState[ind].splice(index, 1);
                    setState(
                      // newState.filter(group => group.length)
                      newState
                    );
                  }}
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
    </div>
  );
}


function Column({ items: el, onDelete, onAdd, onUpdateItem, isDragging, predicate }) {
  return <>{el.map((item, index) => (
    <Item predicate={predicate} key={item.id} item={item} index={index} onDelete={onDelete} onUpdateItem={onUpdateItem} />
  ))}
    <div style={{ visibility: isDragging ? 'hidden' : 'visible' }}>
      <CreateOptions onAdd={onAdd} />
    </div>
  </>
}

function Item({ item, index, onDelete, onUpdateItem, predicate }) {
  const { t: type, r: resizable = false, p: params = {} } = item;
  const { h: height = 500, ...componentProps } = params;
  const Component = chartsTypes[type]?.type ?? (() => <div>not defined</div>);
  const content = <Component predicate={predicate} {...componentProps} setView={view => onUpdateItem({ ...item, p: { view } }, index)} />

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
        <div
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
        </div>
        {!resizable && content}
        {resizable && <Resizable
          enable={{ top: false, right: false, bottom: true, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
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

const CreateOptions = ({ onAdd }) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === '') return;
    onAdd(selectedValue);
  };

  return (
    <div css={css`
      display: flex;
      justify-content: center;
      align-items: center;
    `}>
      <label htmlFor="mySelect" css={css`
        select {
          /* appearance: none;
          width: 100%;
          font-size: 1.15rem;
          padding: 0.675em 6em 0.675em 1em;
          background-color: #fff;
          border: 1px solid #caced1;
          border-radius: 0.25rem;
          color: #000;
          cursor: pointer; */
          background: none;
          border-radius: 4px;
          color: #888;
        }
      `
      }>
        <select value={selectedOption} onChange={handleSelectChange}>
          <option value="">Add</option>
          {Object.keys(chartsTypes).map(type => <option value={type} key={type}>{type}</option>)}
        </select>
      </label>
    </div>
  );
};

// export default DashboardBuilder;

export default uncontrollable(DashboardBuilder, {
  state: 'setState'
});