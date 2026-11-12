import EmojiPicker,{ Categories } from "emoji-picker-react";
import { customEmojis } from "@/app/lib/emojiCustom";
import { createElement, useRef,useEffect } from "react";
import "emoji-picker-element"
import type { EmojiClickEvent} from "emoji-picker-element/shared";
import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill';
type TProps = {
  selectAction: (icon: string) => void;

}
export default function ({ selectAction }: TProps) {

  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return;
    polyfillCountryFlagEmojis();
    const focusSearch = () => {
      if (!ref.current) return;
      ref.current.shadowRoot?.querySelector<HTMLButtonElement>(".nav .nav-button:nth-child(2)")?.click()
      ref.current.shadowRoot?.querySelector<HTMLInputElement>("input[type=search]")?.focus();

    };
    const handler = (event: Event) => {
      const { detail } = event as EmojiClickEvent;

      if (detail.name?.startsWith("custom-")) {
        selectAction(detail.name)
      }
      if (!detail.unicode) return;
      selectAction(detail.unicode)
    }
    const id = requestAnimationFrame(focusSearch);
    ref.current.addEventListener('emoji-click', handler)
    return () => {
      cancelAnimationFrame(id);
      if (!ref.current) return;
      ref.current.removeEventListener("emoji-click", handler);
    };

    }, [ref])

      return createElement('emoji-picker', { ref ,emojiVersion:17.0,customEmoji:customEmojis})
}



/*
<EmojiPicker

  customEmojis={customEmojis}
  colorScheme="auto"
  emojiStyle="twitter"
  emojiVersion={"17"}
  previewConfig={{ showPreview: false }}
  skinTonesDisabled={true}
  columns={9}
  categories={[
    Categories.SMILEYS_PEOPLE,
    Categories.ANIMALS_NATURE,
    Categories.FOOD_DRINK,
    Categories.TRAVEL_PLACES,
    Categories.ACTIVITIES,
    Categories.OBJECTS,
    Categories.SYMBOLS,
    Categories.FLAGS,
    {category:Categories.CUSTOM, group:"custom-icons",name:"Custom icons"}
  ]}
  onEmojiClick={(emojiData) => {

    selectAction(emojiData.emoji);

  }} />
*/
