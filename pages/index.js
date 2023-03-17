import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import tinycolor from "tinycolor2";

const NUM_HUES = 5;

export default function Home() {
  const [textInput, setTextInput] = useState("");
  const [hexCodes, setHexCodes] = useState([]);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput: textInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      // Calculate additional hues for each hexcode
      const fullHexCodes = data.result.flatMap((hexCode) => {
        const baseColor = tinycolor(hexCode);
        const hues = Array.from({ length: NUM_HUES }, (_, i) =>
          baseColor.spin((360 / NUM_HUES) * (i + 1)).toHexString()
        );
        return [hexCode, ...hues];
      });

      setHexCodes(fullHexCodes);
      setTextInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Color Palette Creator</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="text input"
            placeholder="'red roses' or 'blue skies'"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <input type="submit" value="Generate color palette" />
        </form>
        <div className={styles.swatches}>
          {hexCodes.map((hexCode, index) => (
            <div key={`${hexCode}-${index}`} className={styles.swatch}>
              <div style={{ backgroundColor: hexCode }} className={styles.color} />
              <div className={styles.hex}>{hexCode}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
