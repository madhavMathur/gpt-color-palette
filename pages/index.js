import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import tinycolor from "tinycolor2";

const NUM_HUES = 5;

export default function Home() {
  const [textInput, setTextInput] = useState("");
  const [hexCodes, setHexCodes] = useState([]);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
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

      const fullHexCodes = data.result.flatMap((hexCode) => {
        const baseColor = tinycolor(hexCode);
        const baseLightness = 70;
        const hues = Array.from({ length: NUM_HUES }, (_, i) => {
          const hueValue = baseColor.spin((360 / NUM_HUES) * (i + 1)).toHsl().h;
          const saturationValue = baseColor.toHsl().s;
          return tinycolor({ h: hueValue, s: saturationValue, l: baseLightness }).toHexString();
        });
        return [{ hexCode, isOriginalColor: true }, ...hues.map((hue) => ({ hexCode: hue, isOriginalColor: false }))];
      });



      setHexCodes(fullHexCodes);
      setTextInput("");
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  function isOriginalColor(index) {
    return index < originalHexCodes.length;
  }

  return (
    <div className={styles.body}>
      <div>
        <Head>
          <title>OpenAI Quickstart</title>
          <link rel="icon" href="/dog.png" />
        </Head>
        <main className={styles.main}>
          <img src="/dog.png" className={styles.icon} />
          <h3 className={styles.title}>Color Palette Creator</h3>
          <form onSubmit={onSubmit} className={styles.form}>
            <input
              type="text"
              name="text input"
              placeholder="'red roses' or 'blue skies'"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className={styles.input}
            />
            <input type="submit" value="Generate color palette" disabled={loading} className={styles.button} />
            {loading && <span className={styles.loading}>Loading...</span>}
          </form>
          <div className={styles.swatches}>
  {hexCodes.map((hexCode, index) => (
    <div key={`${hexCode}-${index}`} className={styles.swatch}>
      <div
        style={{ backgroundColor: hexCode, border: isOriginalColor(index) ? "3px solid white" : "" }}
        className={styles.color}
      />
      <div className={styles.hex}>{hexCode}</div>
    </div>
  ))}
</div>
        </main>
      </div></div>
  );
}
