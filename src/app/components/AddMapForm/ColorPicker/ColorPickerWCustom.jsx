import { RiPaintFill } from "@remixicon/react";
import styles from "./ColorPickerStyles.module.css";
import { useState, Suspense } from "react";
// Import light and dark

export default function ColorPicker({ selectCallback, cancelCallback, currentColor }) {
  const [customColorOpen, updateCustomColorOpen] = useState(false);
  const possibleColors = process.env.NEXT_PUBLIC_LAYER_COLORS.split(",");
  const isCustom = !possibleColors.includes(currentColor);

  const customLD = lightOrDark(currentColor);

  const colorPicked = (color) => {
    selectCallback(color);
    cancelCallback();
  };

  return (
    <div className={`${styles.container}`}>
      {!customColorOpen && (
        <>
          {possibleColors.map((c) => (
            <button
              onClick={(e) => {
                e.preventDefault();
                colorPicked(c);
              }}
              className={`${styles.button} ${c === currentColor ? styles.selected : ""}`}
              style={{ background: c }}
              key={c}
            />
          ))}
          <button
            className={`${styles.button} ${isCustom ? styles.selected : ""}`}
            style={{ background: currentColor }}
            onClick={(e) => {
              updateCustomColorOpen(true);
            }}
          >
            <RiPaintFill />
          </button>
        </>
      )}
      {customColorOpen && (
        <Suspense>
          <CustomColorPicker />
        </Suspense>
      )}
    </div>
  );
}
