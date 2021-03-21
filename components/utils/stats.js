import React, { useMemo } from 'react';
import cn from 'classnames';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/router';

import { Divider } from 'components/utils';

const Item = ({ num, label, direction, color, link }) => {
  const router = useRouter();
  const value = useMemo(() => {
    let dValue = ['0'];
    const start = (num > 200) ? 200 : 1; 

    for (var i = start; i <= num; i++) {
      dValue.push(_.toString(i));
    }

    if (direction === 'down') {
      dValue = _.reverse(dValue);
    }

    return _.map(dValue, (d, i) => (<p key={`${nanoid()}-${i}`}>{d}</p>));
  }, [num, direction]);

  const _handleOnClick = () => {
    if (link) {
      router.push(link);
    }
  }

  return (
    <div className={cn('stats__item', link && 'link')} onClick={() => {_handleOnClick()}}>
      <div className={cn('stats__item__value', color)}>
        <span className={cn('stats__item__value__num', direction)}>
          {value}
        </span>
      </div>
      <div className={cn('stats__item__divider', color)}/>
      <div className={cn('stats__item__label', link && 'link')}>
        {label}
      </div>
    </div>
  )
}

class Stats extends React.Component {
  static Item = Item;

  render() {
    return (
      <div className="stats">
        {this.props.children}
      </div>
    )
  }
}

export default Stats;
