import Head from 'next/head'

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>English Placement Test</title>
        <meta name="description" content="Embedded Tracktest English Placement Test" />
      </Head>
      <h1 className="text-2xl font-bold mb-4">English Placement Test</h1>
      <div className="w-full max-w-3xl mx-auto">
        <iframe
          className="w-full h-[620px]"
          src="https://app.tracktest.eu/registration?dh=engmed"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>    </div>
  )
}