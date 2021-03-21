import propTypes from 'prop-types';
import UserContextComp from 'context/userContext';
// import 'css/style.css';
import 'sass/main.scss';

function Index({ Component, pageProps }) {
  return (
    <UserContextComp pageProps={pageProps}>
      <Component {...pageProps} />
    </UserContextComp>
  );
}

Index.propTypes = {
  Component: propTypes.func,
  pageProps: propTypes.object
};

export default Index;
