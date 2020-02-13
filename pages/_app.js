import React from "react";
import App from "next/app";
import Link from "next/link";
import fetch from "node-fetch";

import "../layout/layout.scss";

function MyApp({ Component, pageProps, menuItems }) {
  return (
    <React.Fragment>
      <header>
        <div className="container">
          <ul className="Header__Menu">
            {menuItems.map(menuItem => (
              <li key={menuItem.id}>
                <Link href={menuItem.slug || "/"}>
                  <a>{menuItem.title}</a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </header>
      <div className="content container">
        <Component {...pageProps} />
      </div>
      <footer>
        <div className="container">Footer</div>
      </footer>
    </React.Fragment>
  );
}

const fetcher = async (url, params) => {
  const response = await fetch(`http://localhost:3000${url}`);
  return await response.json();
};

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
MyApp.getInitialProps = async appContext => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);

  const menuItems = await fetcher("/api/page");

  return { ...appProps, menuItems };
};

export default MyApp;
