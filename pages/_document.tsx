import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html className="light">
            <Head>
                <link rel="icon" href="/wirtual-icon.png" />
            </Head>
            <body className="dark:bg-gray-800">
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}