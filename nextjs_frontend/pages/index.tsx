import type { NextPage } from 'next'
import Head from 'next/head'
import DecisionEngine from "../components/decision-engine";

const Home: NextPage = () => {
    return (
        <div>
            <Head>
                <title>Decision engine</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="vh-100 d-flex justify-content-center align-items-center">
                <DecisionEngine/>
            </main>
        </div>
    )
}

export default Home
