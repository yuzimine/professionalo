import _ from 'lodash';
import { nanoid } from 'nanoid';
import cn from 'classnames';
import Link from 'next/link';
import propTypes from 'prop-types';

/**
 * 
 * @param {array} param.cardList List of card objects { title, image, content}
 */
const ListCard = ({ cardList }) => {
  const _handleClick = (e) => {
    console.log(e.target);
  };

  const cardContent = (card, key) => {
    const cardImage = card.image || '/img/companylogo.png';
    return (
      <div key={key} className="list-card__container" onClick={(e) => _handleClick(e)}>
        {card.link ?
          <Link href={card.link}>
            <a>
              <img className={cn('list-card__image', card.title && 'smaller')} src={cardImage} />
              {card.title && <div className="list-card__title">
                {card.title}
                </div>}
            </a>
          </Link>
        :
          <>
            <img className={cn('list-card__image', card.title && 'smaller')} src={cardImage} />
            {card.title && <div className="list-card__title">
              {card.title}
            </div>}
          </>
        }
      </div>
    );
  };

  return (
    <div className="list-card">
      {cardList ?
        _.map(cardList, (cl, index) => cardContent(cl, `${nanoid()}-${index}`))
      :
        <p>Empty</p>
      }
    </div>
  );
};

export default ListCard;

ListCard.propTypes = {
  cardList: propTypes.array,
  handleClick: propTypes.func,
};