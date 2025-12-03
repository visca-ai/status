import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>Visca AI - System Status</title>
				<meta name="description" content="Real-time status and uptime monitoring for Visca AI services" />
				<meta property="og:title" content="Visca AI Systems Status" />
				<meta property="og:description" content="Monitor the real-time status of Visca AI Gateway, API, UI, Sandbox, and Docs" />
			</Head>
			<Component {...pageProps} />
		</>
	);
}

export default MyApp;
