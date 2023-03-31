# GPT-4 powered Color Palettes

Analyzes a text prompt and returns a fitting palette of colors, using [OpenAI's API](https://platform.openai.com/docs/quickstart) to run GPT-4 and [tinycolor's API](https://github.com/TinyCommunity/tinycolor2) to manipulate color hues. It uses the [Next.js](https://nextjs.org/) framework with [React](https://reactjs.org/). You can follow the instructions below to get set up.

## Setup

1. If you don’t have Node.js installed, [install it from here](https://nodejs.org/en/) (Node.js version >= 14.6.0 required)

2. Clone this repository

3. Navigate into the project directory

   ```bash
   $ cd openai-quickstart-node
   ```

4. Install the requirements

   ```bash
   $ npm install
   ```

5. Make a copy of the example environment variables file

   On Linux systems: 
   ```bash
   $ cp .env.example .env
   ```
   On Windows:
   ```powershell
   $ copy .env.example .env
   ```
6. Add your [API key](https://platform.openai.com/account/api-keys) to the newly created `.env` file

7. Run the app

   ```bash
   $ npm run dev
   ```

You should now be able to access the app at [http://localhost:3000](http://localhost:3000)!
