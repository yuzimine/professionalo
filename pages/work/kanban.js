import React, { useState, useEffect } from 'react';
import _  from 'lodash';
import { signIn, useSession } from 'next-auth/client';
import { DragDropContext } from 'react-beautiful-dnd';
import useSWR from 'swr';
import propTypes from 'prop-types';

import { postApi, fetcher } from '../../lib/api';
import { Column } from '../../components/kanban';
import { Button } from '../../components/utils';

const initialData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'This is task 1'},
    'task-2': { id: 'task-2', content: 'This is task 2'},
    'task-3': { id: 'task-3', content: 'This is task 3'},
    'task-4': { id: 'task-4', content: 'This is task 4'},
  },
  columns: {
    'column-1': { id: 'column-1', title: 'To Do', taskIds: ['task-2']},
    'column-2': { id: 'column-2', title: 'In Progress', taskIds: ['task-1']},
    'column-3': { id: 'column-3', title: 'Done', taskIds: ['task-3', 'task-4']},
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
};

const Kanban = ({ uid, jobid }) => {
  const [kanban, setKanban] = useState();
  const [session, loading] = useSession();
  const { data } = useSWR(`/api/kanban?uid=${uid}&jobid=${jobid}`, fetcher);

  useEffect(() => {
    setKanban(data);
  }, [data]);

  const populate = () => {
    postApi(`kanban`, JSON.stringify({ uid, jobid, data: initialData }));
  }

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    let destColumn, destTaskIds, same = false;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId) {
      if (destination.index === source.index) {
        return;
      } else {
        same = true;
      }
    }

    const sourceColumn = kanban.columns[source.droppableId];
    const sourceTaskIds = _.has(sourceColumn, 'taskIds') ? Array.from(sourceColumn.taskIds) : [];
    sourceTaskIds.splice(source.index, 1);

    if (!same) {
      destColumn = kanban.columns[destination.droppableId];
      destTaskIds = _.has(destColumn, 'taskIds') ? Array.from(destColumn.taskIds) : [];
      destTaskIds.splice(destination.index, 0, draggableId);
    } else {
      sourceTaskIds.splice(destination.index, 0, draggableId);
    }

    const newSourceColumn = {
      ...sourceColumn,
      taskIds: sourceTaskIds,
    };

    if (!same) {
      const newDestColumn = {
        ...destColumn,
        taskIds: destTaskIds,
      };

      setKanban(prevState => {
        const data = {
          ...prevState,
          columns: {
            ...prevState.columns,
            [sourceColumn.id]: newSourceColumn,
            [destColumn.id]: newDestColumn,
          }
        };
        postApi(`kanban`, JSON.stringify({ uid, jobid, data }));
        return data;
      });
    } else {
      setKanban(prevState => {
        const data = {
          ...prevState,
          columns: {
            ...prevState.columns,
            [sourceColumn.id]: newSourceColumn,
          }
        };
        postApi(`kanban`, JSON.stringify({ uid, jobid, data }));
        return data;
      });
    }
  };

  if (!session && !loading) signIn();

  return (
    <>
      <Button label="Populate" onClick={() => populate()} />
      <DragDropContext
        // onDragStart={onDragStart}
        // onDragUpdate={onDragUpdate}
        onDragEnd={result => onDragEnd(result)}
      >
        <div className="full-page with-flex">
          {kanban && _.map(kanban.columnOrder, columnId => {
            const column = kanban.columns[columnId];
            const tasks = _.map(column.taskIds, (taskId) => kanban.tasks[taskId]);
            return <Column key={columnId} column={column} tasks={tasks} />;
          })}
        </div>
      </DragDropContext>
    </>
  );
};

export default Kanban;

Kanban.propTypes = {
  uid: propTypes.string.isRequired,
  jobid:propTypes.string.isRequired,
};