import { define } from "../utils.ts";

export default define.page(function App({ Component }) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>HIDELIKE_GB</title>
        <style>
          {`
          @font-face {
            font-family: "hide like gb";
            src: url("/font.woff2") format("woff2");
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            background-color: #0f380f;
            color: #8bac0f;
            font-family: "hide like gb", monospace;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            overflow: hidden;
            user-select: none;
          }
        `}
        </style>
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
});
