import __ from 'i18next';
import _ from 'lodash';
import propTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { nanoid } from 'nanoid';

import { Table } from 'components/utils';

/**
 * Show table of job posts
 * 
 * @param {string} param.title Top left title of the post list
 * @param {bool} param.color Color of the title bar (default = red)
 * @param {string} param.add Display the add button and also the Link to the add page
 * @param {array} param.header Table column item names in the header bar
 * @param {data} param.data Table row of data
 * @param {string} param.baseLink Link root path for a row item when it is clicked
 */
const PostList = ({ title, color = 'red', add, header, data, baseLink, ...other }) => {
  const router = useRouter();
  const _handleClick = (id, baseLink) => 
    router.push(__.t(baseLink, { id })).then(() => window.scrollTo(0,0));

  const postHeader = () => {
    return (
      <Table.Header>
        {_.map(header, (hd, index) => (
          <Table.Head {...hd.options} key={`${index}-${nanoid()}`}>
            {hd.text}
          </Table.Head>
        ))}
      </Table.Header>
    );
  }

  const hasData = () => {
    return (
      <Table fill>
        {postHeader()}
        {_.map(data, (post) => {
          const key = _.keys(post)[0];
          return (
            <Table.Row key={key} onClick={() => _handleClick(key, baseLink)} hoverable hovercolor={color}>
              {_.map(post[key], (p) => {
                return <Table.Cell key={nanoid()} {...p.options}>{p.text}</Table.Cell>;
              })}
            </Table.Row>
          );
        })}
      </Table>
    );
  };

  const noData = () => {
    return (
      <>
        <Table fill tableStyle={{ marginBottom: '0.5rem' }}>
          {postHeader()}
        </Table>
        <div className="mtable__empty">{__.t('No Jobs')}</div>
      </>
    );
  };

  return (
    <div {...other}>
      <div className={cn('menubar', color, 'small')}>
        <ul className="menubar__menu left">
          <li className="label">{title}</li>
        </ul>
        {add && <ul className="menubar__menu right">
          <li>
            <Link href={add || ''} replace>
              <a><i className="fas fa-plus"/>&nbsp;{__.t('Add')}</a>
            </Link>
          </li>
        </ul>}
      </div>
      <div className="work__job-list">
        {data && data.length ? hasData() : noData()}
      </div>
    </div>
  );
};

export default PostList;

PostList.propTypes = {
  title: propTypes.string,
  header: propTypes.array,
  data: propTypes.array,
  color: propTypes.string,
  add: propTypes.string,
  baseLink: propTypes.string,
};
