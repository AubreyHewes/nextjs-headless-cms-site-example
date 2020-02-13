import React from "react";
import { withRouter } from "next/router";
import Head from "next/head";
import ErrorPage from "next/error";
import fetch from "node-fetch";

const DynamicRoutePage = ({ router, siteData, pageData, controllerData, error }) => {
  if (error) {
    return <ErrorPage statusCode={error?.status || 404} title={error?.message} />;
  }
  return (
    <div>
      <Head>
        <title>
          {pageData.title} - {siteData.title}
        </title>
      </Head>
      <div>slug: {JSON.stringify(router.query.slug)}</div>
      <div>title: {pageData.title}</div>
      <div>content: {pageData.content}</div>
      <div>controllerData: {JSON.stringify(controllerData)}</div>
    </div>
  );
};

const fetcher = async (url, params) => {
  const response = await fetch(`http://localhost:3000${url}`);
  return await response.json();
};

DynamicRoutePage.getInitialProps = async ({ res, query }) => {
  console.log("getInitialProps", query);

  // find page by initial slug (first part of query.slug)
  const pageData = await fetcher(`/api/page?slug=${query.slug[0]}`);
  console.log("pageData", pageData);
  if (!pageData || pageData.status) {
    if (res) {
      res.statusCode = pageData.status || 500;
    }
    return { error: pageData };
  }
  const isController = /^controller:/.test(pageData.content);
  let controllerData = undefined;
  if (query.slug[1] && !isController) {
    if (res) {
      res.statusCode = 404;
    }
    return { error: { status: 404, message: "Not found" } };
  }
  if (isController) {
    controllerData = await fetcher(`/api/event/${query.slug[1] ? query.slug[1] : ""}`);
    if (!controllerData || controllerData.status) {
      if (res) {
        res.statusCode = controllerData.status || 500;
      }
      return { error: controllerData };
    }
  }
  return {
    siteData: {
      title: "My Site"
    },
    pageData,
    controllerData
  };
};

export default withRouter(DynamicRoutePage);
