import propTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';
import cn from 'classnames';

const Task = (props) => {
  const { task, index } = props;

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={cn('tasks-task', snapshot.isDragging ? 'drag-color' : '')}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <p>{task.content}</p>
        </div>
      )}
    </Draggable>
  );
}

export default Task;

Task.propTypes = {
  index: propTypes.number,
  task: propTypes.object,
};