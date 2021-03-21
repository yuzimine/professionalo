import React from 'react';
import cn from 'classnames';

const Row = ({ responsive, hoverable, hovercolor, children, ...other }) => {
  const styles = cn(
    'mtable__row',
    hoverable ? 'hoverable' : null,
    responsive ? 'responsive' : null,
    hovercolor,
  );

  return (
    <div className={styles} {...other}>
      {children}
    </div>
  )
}

const Empty = ({ children, ...other }) => {
  const styles = cn(
    'mtable__empty',
  );

  return (
    <div className={styles} {...other}>
      {children}
    </div>
  )
}

const Header = ({ responsive, children, ...other }) => {
  const styles = cn(
    'mtable__header',
    responsive ? 'responsive' : null,
  );

  return (
    <div className={styles} {...other}>
      {children}
    </div>
  )
}

const Body = ({ children, ...other }) => {
  return (
    <div className="mtable__body" {...other}>
      {children}
    </div>
  );
}

const Cell = ({ position, responsive, children, ...other }) => {
  const styles = cn(
    'mtable__cell',
    position,
    responsive ? 'responsive' : null,
  );

  return (
    <div className={styles} {...other}>
      {children}
    </div>
  )
}

const Head = ({ position, responsive, children, ...other }) => {
  const styles = cn(
    'mtable__head',
    position,
    responsive ? 'responsive' : null,
  );

  return (
    <div className={styles} {...other}>
      {children}
    </div>
  )
}

class Table extends React.Component {
  static Row = Row;
  static Header = Header;
  static Body = Body;
  static Cell = Cell;
  static Head = Head;
  static Empty = Empty;

  render() {
    const styles = cn(
      'mtable',
      this.props.fill ? 'fill' : null,
    );
    return (
      <div className={styles} style={this.props.tableStyle}>
        {this.props.children}
      </div>
    )
  }
}

export default Table;