import Document, { Html, Head, Main, NextScript } from 'next/document';
import { resetServerContext } from 'react-beautiful-dnd';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const page = await ctx.renderPage();
    const initialProps = await Document.getInitialProps(ctx);
    resetServerContext();
    return { ...initialProps, ...page };
  }

  render() {
    this.getInitialProps;
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="description" content="Freelance for seasoned professionals." />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400&family=Kosugi&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Share:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
          {/* <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@100;400;700&display=swap" rel="stylesheet" /> */}
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="icon" type="image/x-icon" sizes="16x16 32x32" href="/favicon.ico"/>
          <link rel="apple-touch-icon" sizes="152x152" href="/favicon-152-precomposed.png"/>
          <link rel="apple-touch-icon" sizes="144x144" href="/favicon-144-precomposed.png"/>
          <link rel="apple-touch-icon" sizes="120x120" href="/avicon-120-precomposed.png"/>
          <link rel="apple-touch-icon" sizes="114x114" href="/favicon-114-precomposed.png"/>
          <link rel="apple-touch-icon" sizes="180x180" href="/favicon-180-precomposed.png"/>
          <link rel="apple-touch-icon" sizes="72x72" href="/favicon-72-precomposed.png"/>
          <link rel="apple-touch-icon" sizes="57x57" href="/favicon-57.png"/>
          <link rel="icon" sizes="32x32" href="/favicon-32.png"/>
          <meta name="msapplication-TileColor" content="#FFFFFF"/>
          <meta name="msapplication-TileImage" content="/favicon-144.png"/>
          <meta name="theme-color" content="#ffffff"/>
          <link rel="manifest" href="/manifest.json"/>
          <link rel="icon" sizes="192x192" href="/favicon-192.png"/>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;