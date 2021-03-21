import _ from 'lodash';
import __ from 'i18next';
import propTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';
import cn from 'classnames';

import Task from './task';
import { Divider } from '../utils';

const Column = (props) => {
  const { column, tasks } = props;

  return (
    <div key={column.id} className="tasks-column">
      <h1 className="tasks-column-title">{__.t(column.title)}</h1>

      <Divider gutter="small"/>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            className={cn('tasks-column-container', snapshot.isDraggingOver ? 'drag-color' : '')}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {_.map(tasks, (task, index) => <Task key={task.id} task={task} index={index}/>)}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

    </div>
  );
};

export default Column;

Column.propTypes = {
  column: propTypes.object,
  tasks: propTypes.array,
};