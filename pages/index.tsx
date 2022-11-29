import Head from 'next/head'
import Image from 'next/image'

import { ReactElement } from 'react';

import { Keyboard } from "../utils/interfaces";

import useSWR from 'swr';

const a = require("indefinite");

const keyboardLayout = function(layout: string): ReactElement {
  const article = a(layout, {capitalize: true, articleOnly: true});
  return (
    <>
      {article} <strong>{layout}</strong>
    </>
  );
};

const divStyle = function(photoUrl?: string): Object {
  if (photoUrl) {
    return { backgroundImage: `url(${photoUrl})`};
  } else {
    return {};
  }
};

export default function Home() {
  const { data, error } = useSWR<Keyboard, Error>('/api/keyboard', (apiURL: string) => fetch(apiURL).then(res => res.json()))

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <div className="jumbotron jumbotron-fluid heroimage" style={divStyle(data.photo_url)}>
      <Head>
        <title>Keyboarder</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container d-flex">
        <div className="row justify-content-center align-self-center">
          <h1 className="display-4">Consider typing on the <strong>{data.name}</strong></h1>
          <h2 className="display-6">
            {keyboardLayout(data.layout)} keyboard built with&nbsp;
            <strong>{data.switches}</strong> and <strong>{data.keycaps}</strong>
          </h2>
        </div>
      </div>

    </div>
  )
}
